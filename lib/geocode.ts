// Client helper for the address/venue autocomplete. Talks to our own
// /api/places proxy (Google Places when a key is configured, else OpenStreetMap).
// Distance is a straight-line (haversine) estimate scaled to approximate driving.

/** Lila Catering base — set this to the real kitchen address coordinates. */
export const BASE_COORD = { lat: 52.3676, lon: 4.9041 }; // Amsterdam

/** Straight-line → driving approximation factor. */
const ROAD_FACTOR = 1.3;

/** A typed-ahead suggestion (no coordinates until resolved). */
export interface Prediction {
  label: string;
  placeId: string;
}

/** A resolved location with everything needed for transport pricing. */
export interface PlaceResult {
  label: string;
  city: string;
  lat: number;
  lon: number;
  isAmsterdam: boolean;
  /** Estimated driving distance in km from the base. */
  distanceKm: number;
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Estimated road distance in km from the base to a coordinate (rounded). */
export function estimateDistanceKm(to: { lat: number; lon: number }): number {
  return Math.round(haversineKm(BASE_COORD, to) * ROAD_FACTOR);
}

/** Type-ahead search → ranked predictions. */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Prediction[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`, { signal });
  if (!res.ok) throw new Error(`places ${res.status}`);
  const data = (await res.json()) as { predictions?: Prediction[] };
  return data.predictions ?? [];
}

/** Resolve a chosen prediction to a full PlaceResult (coords + transport-ready). */
export async function resolvePlace(pred: Prediction, signal?: AbortSignal): Promise<PlaceResult | null> {
  const res = await fetch(`/api/places?placeId=${encodeURIComponent(pred.placeId)}`, { signal });
  if (!res.ok) return null;
  const d = (await res.json()) as { lat?: number; lon?: number; city?: string };
  if (typeof d.lat !== 'number' || typeof d.lon !== 'number') return null;
  const city = d.city ?? '';
  return {
    label: pred.label,
    city,
    lat: d.lat,
    lon: d.lon,
    isAmsterdam: city.toLowerCase() === 'amsterdam',
    distanceKm: estimateDistanceKm({ lat: d.lat, lon: d.lon }),
  };
}
