import type { Lang } from '@/utils/translations';

export const DEFAULT_LANG: Lang = 'nl';

export function isLang(value: string | null | undefined): value is Lang {
  return value === 'nl' || value === 'en' || value === 'fr';
}

export function getPathWithoutLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  const first = parts[0];
  if (isLang(first)) {
    const rest = parts.slice(1).join('/');
    return `/${rest}`.replace(/\/$/, '') || '/';
  }
  return pathname || '/';
}

export function localePath(lang: Lang, pathname: string): string {
  const without = getPathWithoutLocale(pathname);
  if (without === '/') return `/${lang}`;
  return `/${lang}${without}`;
}


