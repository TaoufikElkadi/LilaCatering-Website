'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

/* Sampled from the approved header artwork. */
const BAR = '#E8E2D6';
const INK = '#4A4743';        // nav links
const INK_STRONG = '#3F3A33'; // active language
const INK_MUTED = '#6B655C';  // inactive languages
const RULE = '#BAAC96';       // hairline divider
const GOLD = '#9E7F57';       // the CTA block
const GOLD_DEEP = '#8B6E49';
const ORNAMENT = '#CFC3AA';

/* Faint khatam rosette that bleeds off each end of the bar. */
function Rosette({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const star = (r1: number, r2: number) =>
    Array.from({ length: 16 }, (_, i) => {
      const a = (Math.PI / 8) * i - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      // fixed precision so the server and client emit the same path string
      return `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`;
    }).join(' ');
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
        <polygon points={star(97, 47)} />
        <polygon points={star(62, 26)} />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 100 100)`}>
            <path d="M100 38 L100 4" />
            <path d="M100 62 C92 74 92 88 100 100 C108 88 108 74 100 62 Z" />
          </g>
        ))}
        <circle cx="100" cy="100" r="9" />
      </g>
    </svg>
  );
}

function InstagramGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  // still over the hero video (homepage): the bar stays transparent until then
  const [overVideo, setOverVideo] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // Hide on scroll-down, reveal on scroll-up (always visible near the very top).
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      // the hero's last stretch dissolves into cream, so count the video as
      // passed ~25% of a screen before the section actually ends
      const hero = document.querySelector('[data-hero]');
      setOverVideo(!!hero && hero.getBoundingClientRect().bottom - window.innerHeight * 0.25 > 72);
      const delta = y - lastY;
      if (y < 140) {
        setHidden(false);
      } else if (Math.abs(delta) > 6) {
        setHidden(delta > 0);
      }
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const basePath = `/${lang}`;
  const navLinks = [
    { name: t('nav.home'), href: basePath },
    { name: t('nav.about'), href: `${basePath}#about` },
    { name: t('nav.gallery'), href: `${basePath}#gallery` },
  ];

  // Desktop top-bar links (left cluster), mirroring an editorial hotel-style nav.
  const desktopLinks = [
    { name: t('footer.services'), href: `${basePath}#services` },
    { name: t('nav.gallery'), href: `${basePath}#gallery` },
    { name: t('nav.about'), href: `${basePath}#about` },
  ];

  const languages: { code: 'en' | 'fr' | 'nl'; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'nl', label: 'NL' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const stripLocale = (p: string) => {
    const parts = p.split('/').filter(Boolean);
    if (parts.length === 0) return '/';
    if (parts[0] === 'nl' || parts[0] === 'en' || parts[0] === 'fr') {
      const rest = parts.slice(1).join('/');
      return `/${rest}`.replace(/\/$/, '') || '/';
    }
    return p || '/';
  };

  const handleLanguageChange = (nextLang: 'en' | 'fr' | 'nl') => {
    const rest = stripLocale(pathname);
    const nextPath = rest === '/' ? `/${nextLang}` : `/${nextLang}${rest}`;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    setLang(nextLang);
    router.push(`${nextPath}${hash}`);
  };

  // On the homepage the bar is transparent over the hero video (white ink,
  // gold mark) and turns into the cream bar once the video is scrolled past.
  const overHero = stripLocale(pathname) === '/' && overVideo && !mobileMenuOpen;
  const ink = overHero ? '#FFFFFF' : INK;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-[transform,opacity,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !mobileMenuOpen
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${scrolled ? 'shadow-[0_1px_24px_-12px_rgba(63,58,51,0.45)]' : ''}`}
        style={{ backgroundColor: overHero ? 'rgba(232,226,214,0)' : BAR }}
      >
        <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-8 lg:px-[8.3%]">
          <div className="relative flex h-16 items-center justify-between sm:h-[72px] lg:h-[124px]">
            {/* Mobile: hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors active:bg-black/5 lg:hidden"
              aria-label="Toggle menu"
              style={{ color: ink }}
            >
              <div className="flex h-4 w-5 flex-col justify-between">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 7, width: '100%' } : { rotate: 0, y: 0, width: '100%' }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] origin-center bg-current"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] w-3/4 bg-current"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -7, width: '100%' } : { rotate: 0, y: 0, width: '50%' }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] origin-center bg-current"
                />
              </div>
            </button>

            {/* Desktop: left — navigation links */}
            <div
              className="hidden items-center gap-10 text-[15px] uppercase tracking-[0.27em] lg:flex xl:gap-[3.7vw]"
              style={{ color: ink }}
            >
              {desktopLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 transition-colors duration-300 ${overHero ? 'hover:text-white/80' : 'hover:text-[#1f1c19]'} after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#9E7F57] after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Centre brand — the calligraphic mark, alone */}
            <Link
              href={basePath}
              aria-label="Lila Catering"
              className="absolute left-1/2 top-1/2 flex h-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center px-4"
              onClick={closeMobileMenu}
            >
              {/* Drawn ~32-58px wide; declaring the source's 460px made Next serve
                  a 920px variant to phones, so the width here is the drawn size. */}
              <Image
                src="/logo-mark.png"
                alt="Lila Catering"
                width={104}
                height={187}
                priority
                className="h-9 w-auto sm:h-10 lg:h-[82px]"
              />
            </Link>

            {/* Desktop: right rail — languages, social, CTA */}
            <div className="hidden items-center lg:flex">
              <div className="flex items-center gap-2">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageChange(item.code)}
                    className="flex h-12 w-12 items-center justify-center rounded-full text-[15px] uppercase tracking-[0.16em] transition-colors duration-300"
                    style={
                      lang === item.code
                        ? overHero
                          ? { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.16)' }
                          : { color: INK_STRONG, backgroundColor: 'rgba(63,58,51,0.07)' }
                        : { color: overHero ? 'rgba(255,255,255,0.8)' : INK_MUTED }
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="mx-[1.6vw] h-8 w-px transition-colors duration-500" style={{ backgroundColor: overHero ? 'rgba(255,255,255,0.45)' : RULE }} />
              <a
                href="https://www.instagram.com/lilacatering/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center transition-opacity duration-300 hover:opacity-70"
                style={{ color: overHero ? '#FFFFFF' : '#241E19' }}
                aria-label="Instagram"
              >
                <InstagramGlyph className="h-[32px] w-[32px]" />
              </a>
              <a
                href={`${basePath}#menu-builder`}
                className="ml-[1.9vw] flex h-[58px] items-center px-9 text-[13px] uppercase tracking-[0.34em] text-white transition-colors duration-300"
                style={{ backgroundColor: GOLD }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GOLD_DEEP)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
              >
                {t('nav.quote')}
              </a>
            </div>

            {/* Mobile: CTA */}
            <a
              href={`${basePath}#menu-builder`}
              onClick={closeMobileMenu}
              className="flex h-10 items-center justify-center px-4 text-[11px] uppercase tracking-[0.18em] text-white lg:hidden"
              style={{ backgroundColor: GOLD }}
            >
              {t('nav.quote')}
            </a>
          </div>
        </div>

        {/* hairline foot, so the bar reads as a plate over the page once scrolled */}
        <span
          className="absolute inset-x-0 bottom-0 h-px transition-opacity duration-500"
          style={{ backgroundColor: RULE, opacity: scrolled ? 0.55 : 0 }}
        />
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ backgroundColor: BAR }}
              onClick={closeMobileMenu}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col px-6 pb-8 pt-20"
            >
              <Rosette
                className="pointer-events-none absolute -right-48 bottom-24 h-[320px] w-[320px] opacity-30"
                style={{ color: ORNAMENT }}
              />

              <nav className="relative flex flex-1 flex-col items-center justify-center space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="block px-6 py-3 text-center font-serif text-2xl tracking-wide transition-colors"
                      style={{ color: INK_STRONG }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className="my-4 h-px w-12"
                  style={{ backgroundColor: RULE }}
                />

                <motion.a
                  href={`${basePath}#services`}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="block py-2 text-center text-lg tracking-wide"
                  style={{ color: INK_MUTED }}
                >
                  {t('footer.services')}
                </motion.a>
                <motion.a
                  href={`${basePath}#menu-builder`}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block py-2 text-center text-lg tracking-wide"
                  style={{ color: GOLD }}
                >
                  {t('footer.getQuote')}
                </motion.a>
              </nav>

              <div className="relative border-t pt-6" style={{ borderColor: RULE }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-4 flex justify-center gap-4"
                >
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageChange(item.code)}
                      className="flex h-11 w-14 items-center justify-center rounded-full text-xs uppercase tracking-[0.15em] transition-all"
                      style={
                        lang === item.code
                          ? { backgroundColor: GOLD, color: '#fff' }
                          : { color: INK_MUTED, border: `1px solid ${RULE}` }
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center"
                >
                  <a
                    href="https://www.instagram.com/lilacatering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-70"
                    style={{ color: '#241E19', borderColor: RULE }}
                    aria-label="Instagram"
                  >
                    <InstagramGlyph className="h-5 w-5" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
