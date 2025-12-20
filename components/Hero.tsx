'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/landingpagevideo.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.35em]"
          >
            {t('hero.kicker')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif uppercase tracking-[0.08em] leading-snug"
          >
            <span className="text-white">
              {t('hero.heading')}
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center space-x-8 text-[12px] uppercase tracking-[0.25em]"
          >
            <a href="#booking" className="pb-1 border-b border-white/60 hover:opacity-100 opacity-80 transition-opacity">
              {t('hero.ctaPrimary')}
            </a>
            <a href="#menu-builder" className="pb-1 border-b border-white/60 hover:opacity-100 opacity-80 transition-opacity">
              {t('hero.ctaSecondary')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
