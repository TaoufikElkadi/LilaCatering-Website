'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

// Shared warm beige/cream blur-up placeholder (tiny 10px JPEG) for smooth loading.
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

type Pillar = { number?: string; title: string; text: string };

// Eight-pointed Moroccan star — the brand's recurring motif.
const EightStar = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0L22.5 17.5L20 20L17.5 17.5L20 0Z" fill="currentColor" />
    <path d="M40 20L22.5 22.5L20 20L22.5 17.5L40 20Z" fill="currentColor" />
    <path d="M20 40L17.5 22.5L20 20L22.5 22.5L20 40Z" fill="currentColor" />
    <path d="M0 20L17.5 17.5L20 20L17.5 22.5L0 20Z" fill="currentColor" />
  </svg>
);

// Zellige medallion — a hollow ring of radial triangular serrations, an outer
// row pointing inward interleaved with an inner row pointing outward, bounded
// by two fine rings. Built by rotating two triangle motifs around the centre.
const ZELLIGE_SEGMENTS = 18;
const ZelligeCircle = ({ className = '' }: { className?: string }) => {
  const step = 360 / ZELLIGE_SEGMENTS;
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="#C19A5B">
        {/* outer teeth pointing inward */}
        {Array.from({ length: ZELLIGE_SEGMENTS }).map((_, i) => (
          <polygon key={`out-${i}`} points="46.5,2.5 53.5,2.5 50,11.5" transform={`rotate(${step * i} 50 50)`} />
        ))}
        {/* inner teeth pointing outward, interleaved into the gaps */}
        {Array.from({ length: ZELLIGE_SEGMENTS }).map((_, i) => (
          <polygon key={`in-${i}`} points="47,19.5 53,19.5 50,11.5" transform={`rotate(${step * i + step / 2} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="48.5" stroke="#C19A5B" strokeWidth="0.9" />
      <circle cx="50" cy="50" r="29.5" stroke="#C19A5B" strokeWidth="0.9" />
    </svg>
  );
};

export default function Craft() {
  const { t, lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const pillars = (t('craft.pillars') as Pillar[]) ?? [];

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

    const handleCanPlay = () => playVideo();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && video.paused) playVideo();
    };
    const handleInteraction = () => {
      if (video.paused) playVideo();
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
    <section
      id="about"
      className="relative isolate overflow-hidden bg-[#f7f3ec] text-[#1f1f1f] pt-24 pb-20 sm:pt-32 sm:pb-28 md:pt-40 md:pb-36"
    >
      {/* Seam transition: eases the dark hero above into this cream canvas. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/[0.07] via-black/[0.02] to-transparent" />

      {/* Zellige-inspired geometric field, barely there over the cream canvas */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="craft-zellige" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M60 18 L66 42 L84 36 L72 54 L90 60 L72 66 L84 84 L66 78 L60 102 L54 78 L36 84 L48 66 L30 60 L48 54 L36 36 L54 42 Z"
                fill="none"
                stroke="#C19A5B"
                strokeWidth="1"
              />
              <circle cx="60" cy="60" r="3" fill="#C19A5B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#craft-zellige)" />
        </svg>
      </div>

      {/* Soft warm glow behind the visual composition */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(193,154,91,0.12),transparent_65%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10">
        {/* ── Editorial text column ───────────────────────────────────── */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 text-[#b8905a]"
          >
            <EightStar className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-[0.35em] sm:text-xs">
              {t('craft.kicker')}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 font-serif text-4xl font-light leading-[1.04] tracking-tight text-[#1f1f1f] sm:text-5xl md:text-6xl"
          >
            {t('craft.title')}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 h-px w-20 origin-left bg-gradient-to-r from-[#C19A5B] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-sm font-light leading-relaxed text-[#6c655b] sm:text-base"
          >
            {t('craft.description')}
          </motion.p>

          {/* Craft principles — each marked with the eight-pointed star */}
          <div className="mt-9 divide-y divide-[#e2d8c6]">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-start gap-4 py-4"
              >
                <ZelligeCircle className="mt-0.5 h-11 w-11 shrink-0 transition-transform duration-500 group-hover:scale-110" />
                <div>
                  <h3 className="font-serif text-lg font-normal tracking-wide text-[#1f1f1f] sm:text-xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-xs font-light leading-relaxed text-[#6c655b] sm:text-sm">
                    {pillar.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <Link
              href={`/${lang}/our-story`}
              className="group mt-10 inline-flex items-center gap-3 border border-[#C19A5B] px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-[#1f1f1f] transition-colors duration-300 hover:bg-[#C19A5B] hover:text-white"
            >
              {t('craft.cta')}
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Asymmetric visual composition ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <div className="relative mx-auto aspect-[5/6] w-full max-w-[480px]">
            {/* Outline star drifting behind the frames */}
            <EightStar className="absolute -right-6 -top-8 h-24 w-24 text-[#C19A5B]/20 sm:h-28 sm:w-28" />

            {/* Primary: framed living video panel */}
            <div className="absolute right-0 top-0 h-[86%] w-[72%] overflow-hidden shadow-[0_36px_70px_-28px_rgba(95,72,38,0.45)]">
              <Image
                src="/craft1.jpg"
                alt={t('craft.images.1.alt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 360px"
                quality={80}
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/craft1.jpg"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  isVideoReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source src="/videos/video3.mp4" type="video/mp4" />
              </video>
              {/* Inset double-frame motif (echoes the hero CTA & cultural cards) */}
              <span className="pointer-events-none absolute inset-[7px] border border-white/30" />
            </div>

            {/* Secondary: overlapping still, anchored bottom-left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 aspect-[3/4] w-[46%] overflow-hidden border-[6px] border-[#f7f3ec] shadow-[0_26px_50px_-22px_rgba(95,72,38,0.5)]"
            >
              <Image
                src="/craft2.jpg"
                alt={t('craft.images.2.alt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 40vw, 220px"
                quality={80}
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <span className="pointer-events-none absolute inset-[6px] border border-white/40" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
