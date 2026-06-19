'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

// Shared warm beige/cream blur-up placeholder (tiny 10px JPEG) for smooth loading.
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

export default function Craft() {
  const { t, lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect users who prefer reduced motion: keep the static poster, skip playback.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsVideoReady(true);
      return;
    }

    const playVideo = async () => {
      try {
        await video.play();
        setIsVideoReady(true);
      } catch {
        setIsVideoReady(true);
      }
    };

    if (video.readyState >= 3) {
      playVideo();
    }

    const handleCanPlay = () => {
      playVideo();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && video.paused) {
        playVideo();
      }
    };

    const handleInteraction = () => {
      if (video.paused) {
        playVideo();
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <section id="about" className="relative bg-[#f7f3ec] text-white py-12 sm:py-24 md:py-28 overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/craft1.jpg"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src="/videos/video3.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-3 sm:space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-white/80"
        >
          {t('craft.kicker')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif uppercase tracking-[0.06em] sm:tracking-[0.08em] leading-snug"
        >
          {t('craft.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto"
        >
          {t('craft.description')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href={`/${lang}/our-story`}
            className="inline-flex items-center justify-center px-6 sm:px-10 py-2.5 sm:py-3 mt-2 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] bg-white text-[#1f1f1f] transition-colors duration-200 active:bg-white/90"
          >
            {t('craft.cta')}
          </Link>
        </motion.div>
      </div>

      {/* Images - Side by side on mobile with square aspect, taller on desktop */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 sm:mt-14 grid grid-cols-2 gap-2 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-square sm:aspect-[3/4]"
        >
          <Image
            src="/craft1.jpg"
            alt={t('craft.images.1.alt')}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 512px"
            quality={80}
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative aspect-square sm:aspect-[3/4]"
        >
          <Image
            src="/craft2.jpg"
            alt={t('craft.images.2.alt')}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 512px"
            quality={80}
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </motion.div>
      </div>
    </section>
  );
}
