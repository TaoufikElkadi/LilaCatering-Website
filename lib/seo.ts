import type { Metadata } from 'next';
import { getTranslation, type Lang, getAvailableLanguages } from '@/utils/translations';
import { getSiteUrl } from '@/lib/site';

import { DEFAULT_LANG, getPathWithoutLocale, localePath } from '@/lib/i18n';

export function buildAlternates(lang: Lang, pathname: string) {
  const languages = getAvailableLanguages();
  const entries = Object.fromEntries(languages.map((l) => [l, localePath(l, pathname)]));
  return {
    canonical: localePath(lang, pathname),
    languages: {
      ...entries,
      'x-default': `/${DEFAULT_LANG}`,
    },
  };
}

export function baseMetadataForLang(lang: Lang): Metadata {
  const site = getSiteUrl() ?? undefined;
  const siteName = String(getTranslation(lang, 'seo.siteName') || 'Lila Catering');
  const defaultTitle = String(getTranslation(lang, 'seo.defaultTitle') || 'Lila Catering');
  const titleTemplate = String(getTranslation(lang, 'seo.titleTemplate') || '%s | Lila Catering');
  const description = String(getTranslation(lang, 'seo.defaultDescription') || '');

  return {
    metadataBase: site,
    applicationName: siteName,
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description,
    openGraph: {
      type: 'website',
      siteName,
      title: defaultTitle,
      description,
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function pageMetadata(lang: Lang, pageKey: 'home' | 'about' | 'gallery'): Pick<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> {
  const title = String(getTranslation(lang, `seo.pages.${pageKey}.title`) || '');
  const description = String(getTranslation(lang, `seo.pages.${pageKey}.description`) || '');
  const ogImage = String(getTranslation(lang, `seo.pages.${pageKey}.ogImage`) || '/h1.jpg');
  const ogAlt = String(getTranslation(lang, `seo.pages.${pageKey}.ogAlt`) || title);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
  };
}


