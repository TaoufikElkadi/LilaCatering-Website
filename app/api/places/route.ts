import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy for address/venue autocomplete. Keeps the Google Maps API
// key secret (never shipped to the browser). Falls back to OpenStreetMap
// (Photon) when GOOGLE_MAPS_API_KEY is not set, so the feature keeps working.
//
// Setup: add GOOGLE_MAPS_API_KEY (a Google Maps key with "Places API (New)"
// enabled) to .env.local and to the Vercel project env vars.

const KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE = { lat: 52.3676, lng: 4.9041 }; // Amsterdam base for location bias

interface Prediction {
  label: string;
  placeId: string;
}

async function googleAutocomplete(input: string): Promise<Prediction[]> {
  const r = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY as string },
    body: JSON.stringify({
      input,
      includedRegionCodes: ['nl'],
      locationBias: { circle: { center: { latitude: BASE.lat, longitude: BASE.lng }, radius: 50000 } },
    }),
  });
  if (!r.ok) throw new Error(`autocomplete ${r.status}`);
  const d = await r.json();
  return (d.suggestions ?? [])
    .filter((s: any) => s.placePrediction)
    .map((s: any) => ({ label: s.placePrediction.text?.text ?? '', placeId: s.placePrediction.placeId }))
    .filter((p: Prediction) => p.label && p.placeId);
}

async function googleDetails(placeId: string) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: { 'X-Goog-Api-Key': KEY as string, 'X-Goog-FieldMask': 'location,addressComponents' },
  });
  if (!r.ok) throw new Error(`details ${r.status}`);
  const d = await r.json();
  const comps: any[] = d.addressComponents ?? [];
  const city =
    comps.find((c) => c.types?.includes('locality'))?.longText ||
    comps.find((c) => c.types?.includes('postal_town'))?.longText ||
    comps.find((c) => c.types?.includes('administrative_area_level_2'))?.longText ||
    '';
  return { lat: d.location?.latitude, lon: d.location?.longitude, city };
}

async function photonAutocomplete(input: string): Promise<Prediction[]> {
  const url =
    `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=8&lat=${BASE.lat}&lon=${BASE.lng}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`photon ${r.status}`);
  const d = await r.json();
  const seen = new Set<string>();
  const out: Prediction[] = [];
  for (const f of d.features ?? []) {
    const p = f.properties ?? {};
    const line1 = p.name || [p.street, p.housenumber].filter(Boolean).join(' ');
    const line2 = [p.postcode, p.city || p.district || p.state].filter(Boolean).join(' ');
    const label = [line1, line2].filter(Boolean).join(', ');
    if (!label || seen.has(label)) continue;
    seen.add(label);
    const [lon, lat] = f.geometry.coordinates;
    const city = p.city || p.district || p.state || '';
    // Photon returns coords inline → encode them in the placeId for resolve.
    out.push({ label, placeId: `osm|${lat}|${lon}|${city}` });
  }
  return out;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const placeId = req.nextUrl.searchParams.get('placeId') ?? '';

  // Resolve a selected prediction to coordinates + city.
  if (placeId) {
    if (placeId.startsWith('osm|')) {
      const [, lat, lon, ...rest] = placeId.split('|');
      return NextResponse.json({ lat: Number(lat), lon: Number(lon), city: rest.join('|') });
    }
    if (KEY) {
      try {
        return NextResponse.json(await googleDetails(placeId));
      } catch {
        return NextResponse.json({ error: 'details_failed' }, { status: 502 });
      }
    }
    return NextResponse.json({ error: 'no_provider' }, { status: 400 });
  }

  // Autocomplete.
  if (q.length < 3) return NextResponse.json({ predictions: [] });
  try {
    const predictions = KEY ? await googleAutocomplete(q) : await photonAutocomplete(q);
    return NextResponse.json({ predictions });
  } catch {
    // If Google fails for any reason, fall back to OSM so search still works.
    try {
      return NextResponse.json({ predictions: await photonAutocomplete(q) });
    } catch {
      return NextResponse.json({ predictions: [] });
    }
  }
}
