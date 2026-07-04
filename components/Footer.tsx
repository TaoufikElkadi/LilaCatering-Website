'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const GOLD = '#C19A5B';

// Zellige rosette medallion (same for every column): an outer ring, a mosaic of
// radiating filled petals with small gap diamonds, and an open circle centre.
const ROSETTE_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);

function Ornament() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 mb-5" aria-hidden="true">
      <circle cx="24" cy="24" r="22.3" fill="none" stroke={GOLD} strokeWidth={1.7} />
      <circle cx="24" cy="24" r="8.6" fill="none" stroke={GOLD} strokeWidth={1.5} />
      {ROSETTE_ANGLES.map((a) => (
        <g key={a} fill={GOLD} transform={`rotate(${a} 24 24)`}>
          {/* long petal reaching from the outer band toward the centre */}
          <path d="M24 3.8 L26.9 9.6 L24 14.4 L21.1 9.6 Z" />
          {/* small gap diamond in the outer band, offset half a step */}
          <path d="M24 4.6 L25.9 8.2 L24 11.2 L22.1 8.2 Z" transform="rotate(15 24 24)" />
        </g>
      ))}
    </svg>
  );
}

export default function Footer() {
  const { t, lang } = useLanguage();
  const [year, setYear] = useState(2026);
  const base = `/${lang}`;
  useEffect(() => setYear(new Date().getFullYear()), []);

  const columns = [
    {
      title: t('footer.companyTitle'),
      links: [
        { label: t('footer.lOverOns'), href: `${base}#about` },
        { label: t('footer.lWerkwijze'), href: `${base}#about` },
        { label: t('footer.lReferenties'), href: `${base}#gallery` },
        { label: t('footer.lContact'), href: `${base}#booking` },
      ],
    },
    {
      title: t('footer.servicesTitle'),
      links: [
        { label: t('footer.lBruiloften'), href: `${base}#services` },
        { label: t('footer.lBedrijfsfeesten'), href: `${base}#services` },
        { label: t('footer.lPrivateDining'), href: `${base}#services` },
        { label: t('footer.lEvenementen'), href: `${base}#services` },
      ],
    },
    {
      title: t('footer.inspirationTitle'),
      links: [
        { label: t('footer.lMenu'), href: `${base}#menu-builder` },
        { label: t('footer.lGerechten'), href: `${base}#gallery` },
        { label: t('footer.lSfeer'), href: `${base}#gallery` },
        { label: t('footer.lProces'), href: `${base}#about` },
      ],
    },
  ];

  const socials = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/lilacatering/',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/lilacatering/',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@lilacatering',
      path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
    },
  ];

  const legal = [
    { label: t('footer.legalPrivacy'), href: '#' },
    { label: t('footer.legalTerms'), href: '#' },
    { label: t('footer.legalCookies'), href: '#' },
  ];

  const linkCls = 'text-[#6c655b] hover:text-[#C19A5B] transition-colors duration-200';

  return (
    <footer className="relative overflow-hidden text-[#1f1f1f]">
      {/* Background starts at the gallery's exact colour (#ebe6dc) and drifts into
          the footer cream over a tall zone — an opaque cross-fade, so no seam can
          appear no matter what sits behind the footer. */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #ebe6dc 0px, #ece1d5 340px)' }}
      />
      {/* Carved zellige arch (left) and hanging lantern with olive branches (right) —
          cropped from the design reference. Each wrapper fades the image top so the
          arch/plants melt in; the inner image fades on its inner side. */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.3) 150px, rgba(0,0,0,0.75) 240px, #000 320px)',
          maskImage:
            'linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.3) 150px, rgba(0,0,0,0.75) 240px, #000 320px)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer/arch.jpg"
          alt=""
          aria-hidden="true"
          className="block h-full w-auto select-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, #000 50%, transparent)',
            maskImage: 'linear-gradient(to right, #000 50%, transparent)',
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute right-0 top-0 h-full hidden sm:block"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.3) 150px, rgba(0,0,0,0.75) 240px, #000 320px)',
          maskImage:
            'linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.3) 150px, rgba(0,0,0,0.75) 240px, #000 320px)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer/lantern.jpg"
          alt=""
          aria-hidden="true"
          className="block h-full w-auto select-none"
          style={{
            WebkitMaskImage: 'linear-gradient(to left, #000 62%, transparent)',
            maskImage: 'linear-gradient(to left, #000 62%, transparent)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Wordmark */}
        <div className="mb-12">
          <p className="font-serif text-3xl sm:text-4xl tracking-[0.12em] text-[#1f1f1f]">LILA</p>
          <p className="text-[11px] tracking-[0.5em] text-[#a8824a] mt-1 ml-1">CATERING</p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {columns.map((col) => (
            <div key={col.title}>
              <Ornament />
              <h3 className="font-serif text-lg text-[#1f1f1f] mb-4">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={linkCls}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <Ornament />
            <h3 className="font-serif text-lg text-[#1f1f1f] mb-4">{t('footer.contactTitle')}</h3>
            <ul className="space-y-3 text-sm text-[#6c655b]">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C19A5B] shrink-0" strokeWidth={1.75} />
                Amsterdam
              </li>
              <li>
                <a href="mailto:info@lilacatering.nl" className={`flex items-center gap-2.5 ${linkCls}`}>
                  <Mail className="w-4 h-4 text-[#C19A5B] shrink-0" strokeWidth={1.75} />
                  info@lilacatering.nl
                </a>
              </li>
              <li>
                <a href="tel:+31203635478" className={`flex items-center gap-2.5 ${linkCls}`}>
                  <Phone className="w-4 h-4 text-[#C19A5B] shrink-0" strokeWidth={1.75} />
                  020 363 5478
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Gold divider with centre flower */}
        <div className="flex items-center gap-4 my-12">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C19A5B]/40" />
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C19A5B] shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 2c1 3 2.5 4.5 5.5 5.5C14.5 8.5 13 10 12 13c-1-3-2.5-4.5-5.5-5.5C9.5 6.5 11 5 12 2zM12 11c1 3 2.5 4.5 5.5 5.5C14.5 17.5 13 19 12 22c-1-3-2.5-4.5-5.5-5.5C9.5 15.5 11 14 12 11z" />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C19A5B]/40" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4 sm:justify-between text-center sm:text-left">
          {/* socials */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-[#d8cbb2] text-[#6c655b] hover:border-[#C19A5B] hover:text-[#C19A5B] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* copyright */}
          <p className="text-xs text-[#8a8275] order-last sm:order-none">
            &copy; {year} Lila Catering. {t('footer.copyright')}
          </p>

          {/* legal */}
          <div className="flex items-center gap-4 text-xs text-[#8a8275]">
            {legal.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-[#C19A5B] transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
