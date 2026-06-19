import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';
import { getAvailableLanguages, type Lang } from '@/utils/translations';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl() ?? new URL('http://localhost:3000');
  const langs = getAvailableLanguages() as Lang[];
  const now = new Date();

  const paths = ['/', '/about', '/gallery'] as const;

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    for (const p of paths) {
      const pathname = p === '/' ? `/${lang}` : `/${lang}${p}`;
      entries.push({
        url: new URL(pathname, site).toString(),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: p === '/' ? 1 : 0.7,
      });
    }
  }

  // Keep root route discoverable (canonical points to /nl via alternates)
  entries.push({
    url: new URL('/', site).toString(),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  });

  return entries;
}


