'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

/*
 * One full-bleed band, rebuilt from the approved artwork (2100 x 749).
 * The zellige arch sits flush left, the Andalusian fretwork bleeds off the
 * right edge, and everything between them is live text so it translates.
 *
 * Every measurement below is taken straight off that artwork and expressed as
 * a share of the section width — percentages for the columns, cqw for type and
 * spacing — so the composition scales as one piece instead of drifting apart.
 * Below xl the band unstacks into photo / copy / seal.
 */
const CANVAS = '#F3EDE2';
const INK = '#0E1411';
const BODY = '#3A3F3C';
const GOLD = '#A97C4C';
const GOLD_LANTERN = '#A5733E';
const RULE_SOFT = '#D3BA9B';   // hairline beside the kicker
const RULE_MID = '#C6A784';    // tall divider before the seal
const RULE_WARM = '#BD9665';   // short rule under the seal
const BTN = '#1A231E';
const BTN_TEXT = '#F6F3EE';

const ARCH = '/images/iftar/iftar-arch.9abf72da.jpg';
const PATTERN = '/images/iftar/iftar-pattern.61344d20.png';            // the band's right-hand strip
const PATTERN_CORNER = '/images/iftar/iftar-pattern-corner.4a9938e6.png'; // the stacked layout's corner

const DIVIDER_X = '73.095%'; // 1535 / 2100
const SEAL_CX = '80.667%';   // 1694 / 2100 — lantern, rule
const CAPTION_CX = '80.798%'; // the caption's trailing letter-space offsets its optical centre

const EASE = [0.16, 1, 0.3, 1] as const;

/* Traced from the lantern in the artwork: onion finial, ribbed dome,
   flared cornice, arched window, stepped plinth. */
function Lantern({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 59 103"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* onion finial with its ring */}
      <path d="M29.5.6c2.1 3 5.3 3.8 5.3 6.5 0 2.1-2.4 3.3-5.3 5.3-2.9-2-5.3-3.2-5.3-5.3 0-2.7 3.2-3.5 5.3-6.5Z" />
      <circle cx="29.5" cy="7.1" r="2.7" />
      {/* pointed outer dome */}
      <path d="M7.2 32.6c0-6.6 2.3-11.1 7-14.8 3.3-2.6 6.4-4.2 9.3-6M51.8 32.6c0-6.6-2.3-11.1-7-14.8-3.3-2.6-6.4-4.2-9.3-6" />
      {/* inner dome shell */}
      <path d="M13.5 32.6c0-6.6 8-16.4 16-16.4s16 9.8 16 16.4" />
      {/* cornice */}
      <path d="M6 33.2h47" />
      <path d="M1 37.6 6 33.2M58 37.6 53 33.2" />
      <path d="M1 37.6h57" strokeWidth="2.2" />
      <path d="M1.5 40.9h56" />
      {/* cage posts */}
      <path d="M2.6 41.4v46.2M56.4 41.4v46.2M7.2 41.4v46.2M51.8 41.4v46.2" />
      {/* shoulder braces */}
      <path d="M7.6 42.8c4.6 1.4 7 4.8 7.6 10.6M51.4 42.8c-4.6 1.4-7 4.8-7.6 10.6" />
      {/* arched window */}
      <path d="M15.2 84.4V52.6c0-6.6 6.3-11.2 14.3-11.2s14.3 4.6 14.3 11.2v31.8" />
      <path d="M15.2 84.4 19 86.9h21l3.8-2.5" />
      <path d="M18.4 86.9h22.2" />
      {/* stepped plinth */}
      <path d="M1.4 88.4h56.2" strokeWidth="2.4" />
      <path d="M1.4 93.2h56.2" strokeWidth="2.4" />
      <path d="M1.6 94.6 6.6 97.6M57.4 94.6 52.4 97.6" />
      <path d="M6.6 99h45.8" strokeWidth="2.8" />
    </svg>
  );
}

export default function IftarSection() {
  const { t } = useLanguage();

  return (
    <section
      id="iftar"
      className="relative overflow-x-clip"
      style={{ backgroundColor: CANVAS, color: INK, containerType: 'inline-size' }}
    >
      <div className="relative xl:min-h-[35.667cqw]">
        {/* ── Zellige arch ───────────────────────────────────────────── */}
        <div className="relative aspect-[16/15] w-full overflow-hidden sm:aspect-[3/2] lg:aspect-[2/1] xl:absolute xl:inset-y-0 xl:left-0 xl:aspect-auto xl:w-[31.619%]">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={ARCH}
              alt={t('iftar.imageAlt')}
              fill
              sizes="(max-width: 1279px) 100vw, 32vw"
              quality={90}
              className="object-cover object-[50%_18%]"
            />
          </motion.div>
        </div>

        {/* Stacked, the fretwork must stay clear of the photo, so it shares a
            positioning context with the copy; at xl that context collapses and
            the fretwork spans the whole band again. */}
        <div className="relative xl:static">
          {/* ── Andalusian zellige ─────────────────────────────────────── */}
          {/* q=75 on both: they are soft decorative overlays, and 90 cost 25%
              more bytes for a difference that does not survive a pixel diff. */}

          {/* Stacked: the zellige sweeps out of the bottom-right corner. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60 sm:left-auto sm:w-[52%] lg:w-[42%] xl:hidden"
          >
            <Image
              src={PATTERN_CORNER}
              alt=""
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1279px) 52vw, 1px"
              quality={75}
              className="object-cover object-bottom"
            />
          </div>

          {/* The band: a vertical strip that runs past the top and bottom edges
              and dissolves into the sections above and below. The asset holds a
              mirrored 150px strip at each end with a smoothstep alpha ramp baked
              in, so the pattern keeps running as one piece and then fades out
              instead of ending on a line. The 749px in the middle is still the
              verified art. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute hidden xl:-top-[7.143cqw] xl:-bottom-[7.143cqw] xl:right-0 xl:block xl:w-[16.19%]"
          >
            <Image
              src={PATTERN}
              alt=""
              fill
              sizes="(min-width: 1280px) 17vw, 1px"
              quality={75}
              className="object-cover object-right"
            />
          </div>

          {/* ── Copy ───────────────────────────────────────────────────── */}
          <div className="relative z-10 px-8 pb-24 pt-9 sm:px-10 sm:py-16 xl:absolute xl:left-[37.048%] xl:top-[6.076cqw] xl:w-[36cqw] xl:p-0">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3.5 xl:gap-[1.29cqw]"
              style={{ color: GOLD }}
            >
              <span className="whitespace-nowrap text-[11px] uppercase leading-none tracking-[0.207em] xl:text-[0.786cqw]">
                {t('iftar.kicker')}
              </span>
              <span className="h-px w-[54px] shrink-0 xl:w-[8.19cqw]" style={{ backgroundColor: RULE_SOFT }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
              className="mt-5 font-display text-[clamp(2.2rem,12.8cqw,3.6rem)] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[3.4rem] xl:-ml-[0.19cqw] xl:mt-[1.419cqw] xl:text-[4.452cqw]"
              style={{ color: INK }}
            >
              {t('iftar.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
              className="mt-4 max-w-[18.5rem] text-[14px] font-light leading-[1.58] sm:mt-5 sm:max-w-[34rem] sm:text-[16px] sm:leading-[1.62] xl:mt-[2.154cqw] xl:max-w-[31.7cqw] xl:text-[1.143cqw] xl:tracking-[0.0254em]"
              style={{ color: BODY }}
            >
              {t('iftar.body')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
              className="mt-[22px] sm:mt-8 xl:mt-[2.048cqw]"
            >
              <a
                href="#menu-builder"
                className="group inline-flex h-11 items-center px-7 transition-opacity duration-300 hover:opacity-90 sm:h-[54px] xl:h-[3.524cqw] xl:pl-[2.143cqw] xl:pr-[2.19cqw] xl:pt-[0.286cqw]"
                style={{ backgroundColor: BTN, color: BTN_TEXT }}
              >
                <span className="whitespace-nowrap text-[11px] uppercase leading-none tracking-[0.212em] xl:text-[0.786cqw]">
                  {t('iftar.cta')}
                </span>
                <svg
                  viewBox="0 0 19 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="ml-5 h-[15px] w-[19px] shrink-0 transition-transform duration-300 group-hover:translate-x-1 xl:ml-[2.071cqw] xl:h-[0.714cqw] xl:w-[0.905cqw]"
                >
                  <path d="M0.6 7.5H17.9M11.4 1.1 17.8 7.5 11.4 13.9" />
                </svg>
              </a>
            </motion.div>

            {/* seal — lantern, rule and caption in a row until the band forms at xl */}
            <div className="mt-8 flex items-stretch gap-5 xl:hidden">
              <Lantern className="h-[56px] w-[33px] shrink-0 self-center" style={{ color: GOLD_LANTERN }} />
              <span className="w-px shrink-0" style={{ backgroundColor: RULE_WARM }} />
              <p
                className="max-w-[8.5rem] self-center text-[10px] uppercase leading-[1.85] tracking-[0.24em]"
                style={{ color: GOLD }}
              >
                {t('iftar.rail')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Seal: divider, lantern, caption ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.35 }}
          className="pointer-events-none absolute inset-0 z-10 hidden xl:block"
        >
          <span
            className="absolute top-[6.381cqw] h-[21.952cqw] w-px"
            style={{ left: DIVIDER_X, backgroundColor: RULE_MID }}
          />
          <Lantern
            className="absolute top-[7.333cqw] h-[4.905cqw] w-[2.81cqw] -translate-x-1/2"
            style={{ left: SEAL_CX, color: GOLD_LANTERN }}
          />
          <p
            className="absolute top-[14.07cqw] w-[9.6cqw] -translate-x-1/2 text-center text-[1cqw] uppercase leading-[2] tracking-[0.262em]"
            style={{ left: CAPTION_CX, color: GOLD }}
          >
            {t('iftar.rail')}
          </p>
          <span
            className="absolute top-[26.19cqw] h-px w-[2.619cqw] -translate-x-1/2"
            style={{ left: SEAL_CX, backgroundColor: RULE_WARM }}
          />
        </motion.div>
      </div>
    </section>
  );
}
