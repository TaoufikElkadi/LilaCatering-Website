'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

type Pillar = { title: string; text: string };

/* Sampled from the approved composition (van_marokko_naar_uw_tafel). */
const CANVAS = '#F6F0E8';
const GOLD = '#AD865D';
const GOLD_SOFT = '#C6A97E';
const GOLD_DEEP = '#9E7645';
const RULE = '#DCCFB8';
const INK = '#111111';
const BODY = '#6B655D';

/*
 * The composition is one 2067 x 760 artwork: a cream field on the left and a
 * terrace scene on the right, meeting in a soft vertical fade. The scene is
 * used as a single image so that fade — and the tajine sitting in front of the
 * arch — survive exactly. Every measurement below is a share of the container
 * width (cqw), taken straight from the artwork, so the whole thing scales as
 * one piece. The clamp minimums keep the copy readable on smaller screens; the
 * section simply grows a little taller there and the scene crops from the top.
 */
const SCENE_SPLIT = '44.51fr 55.49fr';   // where the artwork's fade sits
const SCENE_ASPECT = 1147 / 760;

/* Eight-pointed khatam with an inner rosette — the mark above the kicker. */
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

const SCENE = '/images/origin/origin-scene.d237a182.jpg';          // the desktop artwork
const HERO_MOBILE = '/images/origin/origin-hero-mobile.49679954.jpg'; // stacked: the same terrace, no baked rail
const ORNAMENT = '/images/origin/origin-ornament.c6f0745e.png';
const CALLIGRAPHY = '/images/origin/origin-calligraphy.7b3db671.png';

const ICONS = [
  '/images/origin/icon-spices.e332de77.png',
  '/images/origin/icon-heritage.5bf70733.png',
  '/images/origin/icon-patience.e3ec69d9.png',
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Craft() {
  const { t } = useLanguage();

  const pillars = (t('craft.pillars') as Pillar[]) ?? [];
  const side = t('craft.side') as string;
  const footnote = t('craft.footnote') as string;

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: CANVAS, color: INK }}
    >
      <div
        className="mx-auto flex w-full flex-col lg:grid lg:items-stretch"
        style={{ containerType: 'inline-size', gridTemplateColumns: SCENE_SPLIT }}
      >
        {/* ── Editorial column ───────────────────────────────────────── */}
        <div className="relative order-2 px-8 pb-14 pt-6 sm:px-10 sm:pb-20 sm:pt-10 lg:order-none lg:py-0 lg:pl-[51.8%] lg:pr-[2%] lg:pt-[2.42cqw]">
          {/* Stacked, a soft lattice sits behind the top-right of the copy. */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-4 top-0 w-[54%] max-w-[260px] lg:hidden">
            <Image
              src={ORNAMENT}
              alt=""
              width={280}
              height={332}
              sizes="(max-width: 1023px) 260px, 1px"
              quality={70}
              className="h-auto w-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center gap-2.5 lg:gap-[clamp(0.75rem,1.26cqw,2rem)]"
            style={{ color: GOLD }}
          >
            <Khatam className="h-[22px] w-[22px] shrink-0 lg:h-[clamp(1.6rem,1.6cqw,2.6rem)] lg:w-[clamp(1.6rem,1.6cqw,2.6rem)]" />
            <span className="whitespace-nowrap text-[clamp(11px,0.53cqw,15px)] uppercase leading-none tracking-[0.3em]">
              {t('craft.kicker')}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
            className="relative mt-4 max-w-[7.4em] font-display text-[42px] font-normal leading-[1.05] tracking-[-0.02em] sm:text-[3.2rem] lg:mt-[clamp(1.1rem,2.23cqw,3.4rem)] lg:text-[clamp(2.1rem,3.41cqw,5.2rem)] lg:leading-[0.92]"
            style={{ color: INK }}
          >
            {t('craft.title')}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-5 h-px w-10 origin-left lg:mt-[clamp(0.7rem,0.9cqw,1.6rem)] lg:w-[clamp(46px,4.6cqw,120px)]"
            style={{ backgroundColor: GOLD_SOFT }}
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative mt-5 max-w-[24em] text-[14px] font-light leading-[1.6] lg:mt-[clamp(1rem,1.8cqw,2.6rem)] lg:text-[clamp(13px,0.70cqw,19px)] lg:leading-[1.62]"
            style={{ color: BODY }}
          >
            {t('craft.description')}
          </motion.p>

          {/* Three pillars */}
          <div className="relative mt-7 flex flex-col lg:mt-[clamp(1.5rem,1.7cqw,3.2rem)] lg:gap-[clamp(1.2rem,1.3cqw,2.6rem)]">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: EASE }}
                className={`group flex items-stretch gap-4 py-5 lg:gap-[clamp(0.9rem,1.25cqw,2rem)] lg:border-0 lg:py-0 ${i > 0 ? 'border-t' : ''}`}
                style={{ borderColor: RULE }}
              >
                <Image
                  src={ICONS[i % ICONS.length]}
                  alt=""
                  width={320}
                  height={320}
                  sizes="56px"
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0 self-start object-contain transition-transform duration-500 group-hover:scale-110 lg:h-[clamp(1.9rem,2.13cqw,3.4rem)] lg:w-[clamp(1.9rem,2.13cqw,3.4rem)]"
                />
                <span className="w-px shrink-0" style={{ backgroundColor: RULE }} />
                <div>
                  <h3
                    className="font-display text-[17px] font-normal leading-tight lg:text-[clamp(1rem,0.92cqw,1.7rem)]"
                    style={{ color: INK }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="mt-[0.3em] max-w-[26em] text-[13px] font-light leading-[1.5] lg:text-[clamp(12px,0.63cqw,16.5px)]"
                    style={{ color: BODY }}
                  >
                    {pillar.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing mark */}
          {footnote && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative mt-8 flex items-center gap-4 lg:mt-[clamp(1.6rem,1.9cqw,3.4rem)] lg:gap-[clamp(1rem,1.3cqw,2.2rem)] lg:pb-[1.68cqw]"
              style={{ color: GOLD }}
            >
              <span className="whitespace-nowrap text-[clamp(11px,0.53cqw,15px)] uppercase leading-none tracking-[0.3em]">
                {footnote}
              </span>
              <span className="h-px flex-1 lg:w-[clamp(4rem,9cqw,16rem)] lg:max-w-full lg:flex-none" style={{ backgroundColor: RULE }} />
              {/* أهلاً وسهلاً — closes the stacked layout, as in the artwork */}
              <Image
                src={CALLIGRAPHY}
                alt=""
                aria-hidden="true"
                width={163}
                height={77}
                sizes="(max-width: 1023px) 70px, 1px"
                className="h-8 w-auto shrink-0 lg:hidden"
              />
            </motion.div>
          )}
        </div>

        {/* ── The terrace scene ───────────────────────────────────────
            One image: its own soft left fade meets the canvas, and the
            tajine, dish and linen already sit in front of the arch. */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative order-1 aspect-[880/645] w-full overflow-hidden sm:aspect-[16/9] lg:order-none lg:aspect-auto lg:h-full lg:min-h-[36.77cqw]"
        >
          {/* Stacked: the terrace as a plain photo. The pack's version carries
              the rail baked in, so that corner is healed out and the rail is
              drawn below as live text. */}
          <Image
            src={HERO_MOBILE}
            alt={t('craft.images.1.alt')}
            fill
            sizes="(max-width: 1023px) 100vw, 1px"
            quality={88}
            className="object-cover object-center lg:hidden"
          />
          {/* From lg: the composed artwork, whose own left fade meets the canvas
              and whose tajine, dish and linen already sit in front of the arch. */}
          <Image
            src={SCENE}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 56vw, 1px"
            quality={90}
            className="hidden object-cover object-bottom lg:block"
          />

          {/* the rail the artwork carries, kept as live text so it translates */}
          {side && (
            <div className="absolute left-[6%] top-[13%] flex flex-col items-start gap-4 lg:hidden">
              <p
                className="w-[96px] font-display text-[10px] uppercase leading-[2.1] tracking-[0.18em]"
                style={{ color: '#5E462C' }}
              >
                {side}
              </p>
              <span className="h-12 w-px" style={{ backgroundColor: '#8A6A44' }} />
            </div>
          )}

          {/* the rail the artwork carries, kept as live text so it translates */}
          {side && (
            <div
              className="absolute left-[52.1%] top-[37.1%] hidden flex-col items-start gap-[1.4cqw] xl:flex"
              style={{ color: GOLD_DEEP }}
            >
              <span className="h-[2.2cqw] w-px" style={{ backgroundColor: GOLD_SOFT }} />
              <p className="w-[6.4cqw] min-w-[7em] text-[clamp(10px,0.63cqw,16px)] uppercase leading-[2.3] tracking-[0.3em]">
                {side}
              </p>
              <span className="h-[2.6cqw] w-px" style={{ backgroundColor: GOLD_SOFT }} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
