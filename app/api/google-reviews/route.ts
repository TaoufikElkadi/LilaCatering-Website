import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Cache for 6 hours so we don't hit the Places API on every visit.
export const revalidate = 21600;

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJj4a92QHjxUcR14P3xyjYzvI';

interface GReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
  time: number;
}

export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ reviews: [], rating: null, total: null });

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}` +
      `&fields=rating,user_ratings_total,reviews&reviews_sort=newest&language=nl&key=${key}`;
    const res = await fetch(url, { next: { revalidate } });
    const d = await res.json();
    if (d.status !== 'OK') return NextResponse.json({ reviews: [], rating: null, total: null });

    const result = d.result ?? {};
    // Only showcase positive reviews (4–5★); the aggregate rating stays truthful.
    const reviews = ((result.reviews ?? []) as GReview[])
      .filter((r) => r.rating >= 4 && r.text?.trim())
      .map((r) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        when: r.relative_time_description,
        photo: r.profile_photo_url ?? null,
      }));

    return NextResponse.json({
      reviews,
      rating: result.rating ?? null,
      total: result.user_ratings_total ?? null,
      url: `https://search.google.com/local/reviews?placeid=${PLACE_ID}`,
    });
  } catch {
    return NextResponse.json({ reviews: [], rating: null, total: null });
  }
}
