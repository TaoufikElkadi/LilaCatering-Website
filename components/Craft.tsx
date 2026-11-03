'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

type Pillar = { title: string; text: string };

/*
 * "Van Marokko naar uw tafel" — a window onto Morocco.
 *
 * Editorial copy on the left; on the right two Moorish arch windows (the
 * Koutoubia, and a tajine on a terrace) with a spice bowl set in front of them
 * for depth. The arches drift at slightly different speeds as the page
 * scrolls. The section opens on the same cream the hero video dissolves into,
 * an olive branch hangs across that seam, and the bottom settles into the
 * Services beige — so neither edge reads as a cut.
 */
const CANVAS = '#F6F0E8';
const BELOW = '#EBE6DC'; // Services background
const GOLD = '#AD865D';
const GOLD_SOFT = '#C6A97E';
const RULE = '#DCCFB8';
const INK = '#111111';
const BODY = '#6B655D';

const ARCH_MASK = "url('/images/craft/arch-mask.svg')";
const ICONS = ['/images/craft/icon-leaf.webp', '/images/craft/icon-mandala.webp', '/images/craft/icon-arch.webp'];

const EASE = [0.16, 1, 0.3, 1] as const;

/* Eight-pointed khatam with an inner rosette — the mark beside the kicker. */
const starPoints = (outer: number, inner: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${(24 + r * Math.cos(angle)).toFixed(2)},${(24 + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');

const Khatam = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <polygon points={starPoints(22, 9.5)} stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d="M24 24 C20.6 20 20.6 15.4 24 11.8 C27.4 15.4 27.4 20 24 24 Z"
          transform={`rotate(${i * 45} 24 24)`}
        />
      ))}
    </g>
    <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

/* A photo cut to the Moorish arch silhouette. */
function ArchWindow({ src, alt, sizes, className = '' }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div
      className={`relative aspect-[500/620] overflow-hidden ${className}`}
      style={{ maskImage: ARCH_MASK, WebkitMaskImage: ARCH_MASK, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} quality={82} className="object-cover" />
    </div>
  );
}

/* The same arch as a thin gold line — drawn offset behind a window. */
const ArchOutline = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 500 620" preserveAspectRatio="none" className={className} fill="none" aria-hidden="true">
    <path
      d="M1 620V250A330 330 0 0 1 250 1A330 330 0 0 1 499 250V620"
      stroke={GOLD_SOFT}
      strokeWidth="1.4"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

function reveal(delay: number, y = 16) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.9, delay, ease: EASE },
  };
}

export default function Craft() {
  const { t } = useLanguage();
  const pillars = (t('craft.pillars') as Pillar[]) ?? [];
  const side = t('craft.side') as string;
  const footnote = t('craft.footnote') as string;

  // Gentle depth: the large window rises a little faster than the small one,
  // the bowl in front faster still.
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] });
  const yMain = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [70, -20]);
  const yBowl = useTransform(scrollYProgress, [0, 1], [90, -70]);
  const yBranch = useTransform(scrollYProgress, [0, 1], [-10, 30]);

  return (
    <section
      id="about"
      className="relative isolate overflow-x-clip"
      style={{ color: INK, background: `linear-gradient(to bottom, ${CANVAS} 0%, ${CANVAS} 78%, ${BELOW} 100%)` }}
    >
      {/* Olive branch hanging across the seam with the hero video */}
      <motion.div
        aria-hidden="true"
        style={{ y: yBranch }}
        className="pointer-events-none absolute -top-16 right-[-60px] z-20 w-[230px] rotate-[-14deg] sm:-top-24 sm:w-[320px] lg:right-[4%] lg:w-[380px]"
      >
        <Image src="/images/craft/olive-branch.webp" alt="" width={828} height={560} sizes="380px" className="h-auto w-full drop-shadow-[0_18px_22px_rgba(70,55,30,0.18)]" />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-6 pb-24 pt-20 sm:px-10 sm:pb-24 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-center lg:gap-20 lg:px-12 lg:pb-24 lg:pt-32">
        {/* ── Copy ───────────────────────────────────────────────────── */}
        <div className="relative order-2 lg:order-1">
          <motion.div {...reveal(0, 8)} className="flex items-center gap-3" style={{ color: GOLD }}>
            <Khatam className="h-6 w-6 shrink-0" />
            <span className="whitespace-nowrap text-[11px] uppercase leading-none tracking-[0.32em]">{t('craft.kicker')}</span>
          </motion.div>

          <motion.h2
            {...reveal(0.05)}
            className="mt-6 max-w-[9em] font-display text-[42px] font-normal leading-[1.04] tracking-[-0.02em] sm:text-[54px] lg:text-[clamp(3.2rem,4.6vw,4.5rem)]"
          >
            {t('craft.title')}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-7 h-px w-14 origin-left"
            style={{ backgroundColor: GOLD_SOFT }}
          />

          <motion.p {...reveal(0.2)} className="mt-7 max-w-[30em] text-[16px] leading-[1.7] sm:text-[17px]" style={{ color: BODY }}>
            {t('craft.description')}
          </motion.p>

          <ul className="mt-10 max-w-[32rem]">
            {pillars.map((pillar, i) => (
              <motion.li
                key={pillar.title}
                {...reveal(0.3 + i * 0.1, 12)}
                className="group flex items-start gap-5 border-t py-5 last:border-b"
                style={{ borderColor: RULE }}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                  <Image
                    src={ICONS[i % ICONS.length]}
                    alt=""
                    width={200}
                    height={214}
                    sizes="48px"
                    className="h-10 w-10 object-contain transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-105"
                  />
                </span>
                <div>
                  <h3 className="font-display text-[19px] font-normal leading-tight">{pillar.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.6]" style={{ color: BODY }}>
                    {pillar.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          {footnote && (
            <motion.div {...reveal(0.65, 0)} className="mt-9 flex items-center gap-5" style={{ color: GOLD }}>
              <span className="whitespace-nowrap text-[11px] uppercase leading-none tracking-[0.32em]">{footnote}</span>
              <span className="h-px w-24" style={{ backgroundColor: RULE }} />
            </motion.div>
          )}
        </div>

        {/* ── Windows onto Morocco ───────────────────────────────────── */}
        <div ref={visualRef} className="relative order-1 aspect-[1/1.02] w-full lg:order-2 lg:aspect-[1/1.08]">
          {/* large window: the Koutoubia */}
          <motion.div style={{ y: yMain }} className="absolute right-0 top-0 w-[62%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, ease: EASE }}
              className="relative"
            >
              <ArchOutline className="absolute -right-4 -top-4 h-full w-full sm:-right-5 sm:-top-5" />
              <ArchWindow
                src="/images/craft/koutoubia-arch.webp"
                alt={t('craft.images.1.alt')}
                sizes="(max-width: 1023px) 62vw, 34vw"
              />
            </motion.div>
          </motion.div>

          {/* small window: the tajine on the terrace, with a canvas margin so it
              reads as a separate opening in the same wall */}
          <motion.div style={{ y: ySmall }} className="absolute bottom-[4%] left-0 w-[40%]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
              className="relative p-[7px]"
              style={{ backgroundColor: CANVAS, maskImage: ARCH_MASK, WebkitMaskImage: ARCH_MASK, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
            >
              <ArchWindow src="/images/craft/tajine-terrace.webp" alt="" sizes="(max-width: 1023px) 40vw, 22vw" />
            </motion.div>
          </motion.div>

          {/* rail above the small window */}
          {side && (
            <motion.div
              {...reveal(0.4, 0)}
              className="absolute left-[3%] top-[6%] hidden flex-col items-start gap-4 sm:flex"
              style={{ color: GOLD }}
            >
              <span className="h-10 w-px" style={{ backgroundColor: GOLD_SOFT }} />
              <p className="w-[11em] text-[11px] uppercase leading-[2.2] tracking-[0.3em]">{side}</p>
              <span className="h-10 w-px" style={{ backgroundColor: GOLD_SOFT }} />
            </motion.div>
          )}

          {/* spice bowl set in front of both windows (its contact shadow is in the asset) */}
          <motion.div style={{ y: yBowl }} className="absolute bottom-[-6%] left-[30%] w-[40%]">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
              className="relative"
            >
              <Image
                src="/images/craft/spice-bowl.webp"
                alt=""
                width={900}
                height={862}
                sizes="(max-width: 1023px) 40vw, 22vw"
                className="relative h-auto w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
