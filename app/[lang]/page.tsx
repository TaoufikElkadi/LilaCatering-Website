import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import { buildAlternates, pageMetadata } from '@/lib/seo';
import { DEFAULT_LANG, isLang } from '@/lib/i18n';

// Lazy load components below the fold so they don't block the initial load.
// ssr: true keeps them server-rendered for SEO; only their JS is code-split & deferred.
// Trusted-by logos hidden for now
// const CompanyLogos = dynamic(() => import('@/components/CompanyLogos'), {
//   ssr: true,
//   loading: () => <div className="h-32 bg-[#f7f3ec]" />,
// });

const Craft = dynamic(() => import('@/components/Craft'), {
  ssr: true,
  loading: () => <div className="h-96 bg-[#f7f3ec]" />,
});

const CulturalAuthenticity = dynamic(() => import('@/components/CulturalAuthenticity'), {
  ssr: true,
  loading: () => <div className="h-96 bg-[#f7f3ec]" />,
});

const Services = dynamic(() => import('@/components/Services'), {
  ssr: true,
  loading: () => <div className="h-96 bg-[#ebe6dc]" />,
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  ssr: true,
  loading: () => <div className="h-64 bg-[#f7f3ec]" />,
});

const MenuBuilder = dynamic(() => import('@/components/MenuBuilder'), {
  ssr: true,
  loading: () => <div className="h-96 bg-[#f7f3ec]" />,
});

const Gallery = dynamic(() => import('@/components/Gallery'), {
  ssr: true,
  loading: () => <div className="h-96 bg-[#ebe6dc]" />,
});

export async function generateStaticParams() {
  return [
    { lang: 'nl' },
    { lang: 'en' },
    { lang: 'fr' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = isLang(langParam) ? langParam : DEFAULT_LANG;
  return {
    ...pageMetadata(lang, 'home'),
    alternates: buildAlternates(lang, '/'),
  };
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* Trusted-by logos hidden for now */}
      {/* <CompanyLogos /> */}
      <Reveal><Craft /></Reveal>
      <Reveal><CulturalAuthenticity /></Reveal>
      <Reveal><Services /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><MenuBuilder /></Reveal>
      <Reveal><Gallery /></Reveal>
    </main>
  );
}


