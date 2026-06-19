export function getSiteUrl(): URL | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}


