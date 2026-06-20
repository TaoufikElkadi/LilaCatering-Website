'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

// Inline, language-aware micro-copy for the hero / reservation bar.
const L = {
  tagline: {
    nl: ['Authentieke Marokkaanse', 'keuken & gastvrijheid'],
    en: ['Authentic Moroccan', 'cuisine & hospitality'],
    fr: ['Cuisine marocaine', 'authentique & hospitalité'],
  },
  date: { nl: 'Datum', en: 'Date', fr: 'Date' },
  guests: { nl: 'Aantal gasten', en: 'Guests', fr: 'Convives' },
  eventType: { nl: 'Type evenement', en: 'Event type', fr: "Type d'événement" },
  reserve: { nl: 'Reserveren', en: 'Reserve', fr: 'Réserver' },
  eventOptions: {
    nl: ['Bruiloft', 'Privédiner', 'Zakelijk evenement', 'Feest'],
    en: ['Wedding', 'Private dinner', 'Corporate event', 'Celebration'],
    fr: ['Mariage', 'Dîner privé', 'Événement pro', 'Fête'],
  },
} as const;

export default function Hero() {
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const start = () => setEnableVideo(true);
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    });
    if (typeof ric.requestIdleCallback === 'function') {
      const id = ric.requestIdleCallback(start, { timeout: 1500 });
      return () => ric.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(start, 300);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!enableVideo) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        /* autoplay may be blocked; resumes on interaction */
      }
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      playVideo();
    };
    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      playVideo();
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting && video.paused) playVideo();
      }),
      { threshold: 0.1 }
    );
    observer.observe(video);

    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
      playVideo();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && video.paused) playVideo();
    };
    const handleInteraction = () => {
      if (video.paused) playVideo();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('touchmove', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      observer.disconnect();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchmove', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [enableVideo]);

  const tagline = L.tagline[lang];
  const eventOptions = L.eventOptions[lang];

  return (
    <section className="relative h-[108vh] min-h-[720px] w-full overflow-hidden bg-black text-white">
      {/* Background video */}
      <div className="absolute inset-0 bg-black">
        <Image
          src="/herovideoAI-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover"
        />
        {enableVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            poster="/herovideoAI-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controls={false}
            style={{ pointerEvents: 'none' }}
          >
            <source src="/herovideoAI.mp4" type="video/mp4" />
          </video>
        )}
        {/* No overall tint — only soft top/bottom gradients so the nav, tagline
            and reservation bar stay legible over the video. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
      </div>

      {/* Soft focal glow behind the logo so it stays legible over bright video
          frames, without tinting the whole video. */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[760px] h-[620px] max-w-[92vw] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45),rgba(0,0,0,0.2)_45%,transparent_70%)]" />

      {/* Foreground: the FIRST viewport holds the centered logo + reservation bar
          (so the bar is always fully visible); the section itself is a touch
          taller, so a sliver of video shows below the fold. */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Centered logo lockup */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        {/* Location / tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-1 text-[10px] sm:text-[11px] uppercase tracking-[0.42em] text-white/85"
        >
          {tagline.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </motion.div>

        {/* Full logo — LCP element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 sm:mt-8"
        >
          <Image
            src="/logo-full.png"
            alt="Lila Catering"
            width={937}
            height={1016}
            priority
            sizes="(max-width: 640px) 210px, 300px"
            className="w-[200px] sm:w-[260px] md:w-[300px] h-auto drop-shadow-[0_10px_34px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>

        {/* Reservation bar — pinned to the bottom of the first viewport */}
        <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-[4px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] flex flex-col md:flex-row md:items-stretch overflow-hidden">
            {/* Field: Date */}
            <label className="flex-1 flex flex-col justify-center px-6 py-4 border-b md:border-b-0 md:border-r border-[#e7ddcb] cursor-pointer">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#a8824a] mb-1.5">{L.date[lang]}</span>
              <input
                type="date"
                className="w-full bg-transparent text-sm font-serif text-[#1f1f1f] outline-none cursor-pointer"
              />
            </label>

            {/* Field: Guests */}
            <label className="flex-1 flex flex-col justify-center px-6 py-4 border-b md:border-b-0 md:border-r border-[#e7ddcb] cursor-pointer">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#a8824a] mb-1.5">{L.guests[lang]}</span>
              <select className="w-full bg-transparent text-sm font-serif text-[#1f1f1f] outline-none cursor-pointer appearance-none">
                {['40', '60', '100', '150', '250+'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>

            {/* Field: Event type */}
            <label className="flex-1 flex flex-col justify-center px-6 py-4 border-b md:border-b-0 md:border-r border-[#e7ddcb] cursor-pointer">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#a8824a] mb-1.5">{L.eventType[lang]}</span>
              <select className="w-full bg-transparent text-sm font-serif text-[#1f1f1f] outline-none cursor-pointer appearance-none">
                {eventOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            {/* Reserve button */}
            <a
              href="#menu-builder"
              className="group/res flex items-center justify-center gap-2 px-10 md:px-12 py-5 md:py-0 bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] text-[#1f1f1f] text-xs uppercase tracking-[0.28em] font-medium transition-all duration-300 hover:tracking-[0.32em]"
            >
              {L.reserve[lang]}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/res:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
