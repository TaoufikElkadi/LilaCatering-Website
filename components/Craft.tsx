'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function Craft() {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-[#f7f3ec] text-white py-24 md:py-28 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video3.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 text-center space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.35em] text-white/80"
        >
          {t('craft.kicker')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl font-serif uppercase tracking-[0.08em] leading-snug"
        >
          {t('craft.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base md:text-lg text-white/90 max-w-2xl mx-auto"
        >
          {t('craft.description')}
        </motion.p>
        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center px-10 py-3 mt-2 text-sm uppercase tracking-[0.25em] bg-white text-[#1f1f1f] transition-colors duration-200 hover:bg-white/90"
        >
          {t('craft.cta')}
        </motion.a>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-[3/4]"
        >
          <Image
            src="/craft1.jpg"
            alt="Chef crafting Moroccan dish"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative aspect-[3/4]"
        >
          <Image
            src="/craft2.jpg"
            alt="Embers and grill for Moroccan cooking"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
