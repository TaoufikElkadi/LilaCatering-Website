'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
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
  cta: { nl: 'Reserveer uw evenement', en: 'Book your event', fr: 'Réservez votre événement' },
  eventOptions: {
    nl: ['Bruiloft', 'Privédiner', 'Zakelijk evenement', 'Feest'],
    en: ['Wedding', 'Private dinner', 'Corporate event', 'Celebration'],
    fr: ['Mariage', 'Dîner privé', 'Événement pro', 'Fête'],
  },
} as const;

const MUSIC_VOLUME = 0.45;

/**
 * True when the visitor has asked for less data, or is on a radio too slow to
 * justify multi-megabyte decoration. Gates the hero video (and with it the music).
 */
function prefersLightData(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g';
}

export default function Hero() {
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);
  // The reel's own music rides in the video file so it stays in sync with the
  // footage. Browsers only autoplay muted video, so it plays muted and is
  // unmuted on the first genuine user gesture; the toggle lets the visitor mute
  // it. Default "on" (intent to play once a gesture allows it).
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(soundOn);
  soundOnRef.current = soundOn;
  // Set once the visitor has interacted: unmuting before that would make the
  // browser pause the video.
  const activatedRef = useRef(false);

  // Returns whether the video is now audibly playing. If the browser refuses
  // to play unmuted (no activation it recognises), fall back to muted playback
  // so the visuals never stall, and report false so the next gesture retries.
  const applySound = async (): Promise<boolean> => {
    const video = videoRef.current;
    if (!video) return false;
    video.volume = MUSIC_VOLUME;
    const wantSound = soundOnRef.current && activatedRef.current;
    video.muted = !wantSound;
    try {
      await video.play();
      return wantSound;
    } catch {
      video.muted = true;
      video.play().catch(() => { /* still awaiting a gesture */ });
      return false;
    }
  };

  useEffect(() => {
    // Only events browsers accept as activation for audio: Safari ignores
    // pointerdown/touchstart, so click/touchend/keydown are the reliable ones.
    // Scrolling is not activation at all. Listeners stay until sound starts.
    const events = ['click', 'touchend', 'keydown'] as const;
    const onInteract = async () => {
      activatedRef.current = true;
      if (!soundOnRef.current) return detach();
      if (await applySound()) detach();
    };
    const detach = () => events.forEach((e) => document.removeEventListener(e, onInteract));
    events.forEach((e) => document.addEventListener(e, onInteract));
    return detach;
  }, []);

  const toggleSound = () => {
    activatedRef.current = true;
    soundOnRef.current = !soundOnRef.current;
    setSoundOn(soundOnRef.current);
    applySound();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // The reel is ~6 MB. On Save-Data or a slow radio the poster alone is the
    // better hero, so the video simply never starts downloading.
    if (prefersLightData()) return;
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

    // Muted unless the visitor already interacted before the video mounted.
    video.volume = MUSIC_VOLUME;
    video.muted = !(soundOnRef.current && activatedRef.current);
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

    // The video carries music now, so it must not keep playing in a hidden tab.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (video.paused) playVideo();
      } else {
        video.pause();
      }
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
    <section className="relative h-[100svh] min-h-[680px] sm:h-[118vh] sm:min-h-[780px] w-full overflow-hidden bg-[#F6F0E8] sm:bg-black text-white">
      {/* Background video. On phones the landscape reel would be cropped to a
          thin vertical slice, so the video area stops short of the section
          bottom (shorter box = less crop, i.e. zoomed out) and fades into the
          cream below. */}
      <div className="absolute inset-x-0 top-0 bottom-[17%] sm:bottom-0 bg-black [mask-image:linear-gradient(to_bottom,#000_80%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_80%,transparent)] sm:[mask-image:none] sm:[-webkit-mask-image:none]">
        <Image
          src="/hero-reel-poster.jpg"
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
            poster="/hero-reel-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controls={false}
            style={{ pointerEvents: 'none' }}
          >
            {/* Lila's own reel. AV1 first (smaller), H.264 for Safari/older devices. */}
            <source src="/hero-reel-v2.webm" type='video/webm; codecs="av01.0.05M.08"' />
            <source src="/hero-reel-v2.mp4" type="video/mp4" />
          </video>
        )}
        {/* No overall tint — only soft top/bottom gradients so the nav, tagline
            and reservation bar stay legible over the video. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
        {/* Below the reservation bar the video dissolves into the cream the
            next section opens on, so the page flows on instead of cutting. */}
        <div
          className="absolute inset-x-0 bottom-0 hidden h-[30vh] pointer-events-none sm:block"
          style={{
            background:
              'linear-gradient(to bottom, rgba(246,240,232,0) 0%, rgba(246,240,232,0.18) 22%, rgba(246,240,232,0.55) 48%, rgba(246,240,232,0.86) 72%, #F6F0E8 100%)',
          }}
        />
      </div>

      {/* Soft focal glow behind the logo so it stays legible over bright video
          frames, without tinting the whole video. */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[760px] h-[440px] sm:h-[620px] max-w-[92vw] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45),rgba(0,0,0,0.2)_45%,transparent_70%)]" />

      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={soundOn ? 'Geluid uit' : 'Geluid aan'}
        aria-pressed={soundOn}
        className="absolute z-20 top-[calc(100svh-8.5rem)] right-4 sm:top-[calc(100vh-9rem)] sm:right-6 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white/90 hover:bg-black/60 hover:border-white/50 transition-colors"
      >
        {soundOn ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
      </button>

      {/* Foreground: the FIRST viewport holds the centered logo + reservation bar
          (so the bar is always fully visible); the section itself runs on below
          the fold, where the video dissolves into the next section's cream. */}
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
            sizes="(max-width: 640px) 240px, 300px"
            className="w-[230px] sm:w-[260px] md:w-[300px] h-auto drop-shadow-[0_10px_34px_rgba(0,0,0,0.5)]"
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
          {/* Mobile: a single clean CTA (the full builder collects the details) */}
          <a
            href="#menu-builder"
            className="md:hidden group/cta relative flex items-center justify-center gap-2.5 w-full min-h-[60px] rounded-[4px] bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] text-[#1f1f1f] text-sm uppercase tracking-[0.2em] font-medium shadow-[0_18px_44px_-16px_rgba(193,154,91,0.85)] active:scale-[0.98] transition-transform"
          >
            <span className="pointer-events-none absolute inset-[5px] rounded-[3px] border border-white/30" />
            <span className="relative">{L.cta[lang]}</span>
            <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Desktop: full reservation bar */}
          <div className="hidden md:flex bg-white rounded-[4px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] md:flex-row md:items-stretch overflow-hidden">
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
