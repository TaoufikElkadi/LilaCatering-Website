'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.gallery'), href: '/gallery' },
  ];

  const languages: { code: 'en' | 'fr' | 'nl'; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'nl', label: 'NL' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-sm bg-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 text-white">
          {/* Left rail: languages */}
          <div className="flex items-center space-x-3 text-[11px] tracking-[0.2em] uppercase">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`transition-opacity ${lang === item.code ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Center brand */}
          <Link href="/" className="flex items-center justify-center">
            <span className="text-sm font-serif tracking-[0.3em] uppercase">Lila Catering</span>
          </Link>

          {/* Right rail: actions */}
          <div className="flex items-center space-x-6 text-[12px] tracking-[0.25em] uppercase">
            <a
              href="#booking"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              {t('nav.bookAppointment')}
            </a>
            <a
              href="#menu-builder"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              {t('nav.quote')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
