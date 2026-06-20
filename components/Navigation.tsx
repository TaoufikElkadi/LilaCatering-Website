'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
  // On the homepage hero (before scroll) the big centered wordmark stands in for the
  // brand, so the small nav brand is hidden to avoid competing with it.
  const isHome = pathname === basePath || pathname === `${basePath}/`;
  const hideBrand = isHome && !scrolled && !mobileMenuOpen;
  const navLinks = [
    { name: t('nav.home'), href: basePath },
    { name: t('nav.ourStory'), href: `${basePath}/our-story` },
    { name: t('nav.about'), href: `${basePath}#about` },
    { name: t('nav.gallery'), href: `${basePath}#gallery` },
  ];

  // Desktop top-bar links (left cluster), mirroring an editorial hotel-style nav.
  const desktopLinks = [
    { name: t('footer.services'), href: `${basePath}#services` },
    { name: t('nav.gallery'), href: `${basePath}#gallery` },
    { name: t('nav.about'), href: `${basePath}#about` },
    { name: t('nav.ourStory'), href: `${basePath}/our-story` },
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

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-[transform,opacity,background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !mobileMenuOpen
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${
          scrolled
            ? 'backdrop-blur-xl bg-black/60 shadow-lg shadow-black/10'
            : mobileMenuOpen
            ? 'backdrop-blur-xl bg-black/60'
            : isHome
            ? 'bg-transparent'
            : 'bg-gradient-to-b from-black/50 to-transparent'
        }`}
      >
        {/* Decorative top border on scroll */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0 }}
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C19A5B] to-transparent origin-center"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative flex items-center justify-between h-14 sm:h-16 lg:h-20 text-white">
            {/* Mobile: Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 -ml-1 rounded-full active:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 7, width: '100%' } : { rotate: 0, y: 0, width: '100%' }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] bg-white origin-center"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] w-3/4 bg-white"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -7, width: '100%' } : { rotate: 0, y: 0, width: '50%' }}
                  transition={{ duration: 0.2 }}
                  className="block h-[1.5px] bg-white origin-center"
                />
              </div>
            </button>

            {/* Desktop: Left - navigation links */}
            <div className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase">
              {desktopLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-white/75 hover:text-white transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[#C19A5B] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Center brand — logo mark; hidden on the homepage hero (full logo stands in) */}
            <Link
              href={basePath}
              aria-label="Lila Catering"
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group transition-opacity duration-500 ${
                hideBrand ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              onClick={closeMobileMenu}
            >
              <Image
                src="/logo-mark.png"
                alt="Lila Catering"
                width={460}
                height={828}
                priority
                className="h-9 sm:h-10 w-auto"
              />
            </Link>

            {/* Desktop: Right rail - actions */}
            <div className="hidden lg:flex items-center gap-3 text-[10px] tracking-[0.15em] uppercase">
              {/* Language toggle */}
              <div className="flex items-center gap-0.5 pr-1">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageChange(item.code)}
                    className={`h-8 px-2.5 flex items-center justify-center rounded-full transition-all duration-300 ${
                      lang === item.code
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="h-4 w-px bg-white/20" />
              <a
                href="https://www.instagram.com/lilacatering/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={`${basePath}#menu-builder`}
                className="h-9 px-5 flex items-center border border-[#C19A5B] bg-transparent text-white transition-all duration-300 font-medium hover:bg-[#C19A5B] hover:text-white"
              >
                {t('nav.quote')}
              </a>
            </div>

            {/* Mobile: CTA button */}
            <a
              href={`${basePath}#menu-builder`}
              onClick={closeMobileMenu}
              className="lg:hidden flex items-center justify-center h-8 px-4 bg-[#C19A5B] text-white text-[9px] tracking-[0.12em] uppercase font-medium"
            >
              {t('nav.quote')}
            </a>
          </div>
        </div>
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={closeMobileMenu}
            />

            {/* Menu Content - Full screen overlay */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col pt-20 pb-8 px-6"
            >
              {/* Navigation Links - Centered */}
              <nav className="flex-1 flex flex-col items-center justify-center space-y-1">
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
                      className="block py-3 px-6 text-white text-2xl font-serif tracking-wide text-center active:text-[#C19A5B] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Decorative divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-12 h-[1px] bg-[#C19A5B]/50 my-4"
                />

                {/* Action links */}
                <motion.a
                  href={`${basePath}#services`}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="block py-2 text-white/60 text-lg tracking-wide text-center"
                >
                  {t('footer.services')}
                </motion.a>
                <motion.a
                  href={`${basePath}#menu-builder`}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block py-2 text-[#C19A5B] text-lg tracking-wide text-center"
                >
                  {t('footer.getQuote')}
                </motion.a>
              </nav>

              {/* Bottom: Language Selector & Social */}
              <div className="border-t border-white/10 pt-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-4 mb-4"
                >
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageChange(item.code)}
                      className={`h-10 w-14 flex items-center justify-center text-xs tracking-[0.15em] uppercase rounded-full transition-all ${
                        lang === item.code
                          ? 'bg-[#C19A5B] text-white'
                          : 'text-white/50 border border-white/20'
                      }`}
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
                    className="h-10 w-10 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full border border-white/20"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
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
