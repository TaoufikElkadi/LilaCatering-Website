'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

/*
 * "Iftar op locatie" — rebuilt from the approved mockup (1672 wide).
 *
 * Nothing in this band ends on a line. The tea-set arch photo carries its own
 * plaster wall past the section's top and bottom (the extra wall is extended
 * from the photo's edges and dissolves via a baked alpha ramp), and the carved
 * zellige corner rises out of the section above. The section background starts
 * in the Services beige and settles into the canvas, and ends on the canvas
 * colour Testimonials starts with.
 *
 * At xl every measurement is a share of the section width (cqw), taken off the
 * mockup, so the composition scales as one piece. Below xl it stacks.
 */
const CANVAS = '#F3EDE2';
const ABOVE = '#EBE6DC'; // Services background
const INK = '#19231E';
const BODY = '#3A3F3C';
const GOLD = '#B78C4A';
const RULE = '#D3BA9B';
const BTN = '#333A20';
const BTN_HOVER = '#272D18';
const BTN_TEXT = '#F6F3EE';

// 1526 x 1624; the photo itself spans y 18.5%–88.9% and x 0–81.7%.
const ARCH = '/images/iftar/iftar-tea-arch.webp';
const ZELLIGE = '/images/iftar/iftar-pattern-corner.4a9938e6.png';

const EASE = [0.16, 1, 0.3, 1] as const;

function reveal(delay: number, y = 14) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay, ease: EASE },
  };
}

export default function IftarSection() {
  const { t } = useLanguage();

  return (
    <section
      id="iftar"
      className="relative"
      style={{
        color: INK,
        containerType: 'inline-size',
        background: `linear-gradient(to bottom, ${ABOVE} 0%, ${CANVAS} 9%, ${CANVAS} 100%)`,
      }}
    >
      {/* Section clips sideways only, so the art can run into its neighbours. */}
      <div className="relative overflow-x-clip xl:min-h-[35cqw]">
        {/* ── Tea-set arch ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none relative -mt-[12vw] w-[min(100%,620px)] aspect-[1526/1624] sm:-mt-20 xl:absolute xl:left-0 xl:-top-[8.7cqw] xl:mt-0 xl:w-[44.1cqw]"
        >
          <Image
            src={ARCH}
            alt={t('iftar.imageAlt')}
            fill
            sizes="(max-width: 1279px) 620px, 45vw"
            quality={85}
            className="object-contain"
          />
        </motion.div>

        {/* ── Carved zellige, rising out of the section above ────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[28vw] w-[46vw] aspect-[1024/1536] opacity-60 sm:top-[18vw] sm:w-[34vw] xl:-top-[5cqw] xl:w-[33cqw] xl:opacity-100"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, #000 16%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 16%)',
          }}
        >
          {/* the asset sweeps out of a bottom corner; flipped, it hangs from the top */}
          <Image
            src={ZELLIGE}
            alt=""
            fill
            sizes="(max-width: 1279px) 46vw, 26vw"
            quality={75}
            className="object-cover -scale-y-100"
          />
        </div>

        {/* ── Copy ───────────────────────────────────────────────────── */}
        <div className="relative z-10 px-6 pb-20 pt-2 sm:px-10 sm:pb-24 xl:absolute xl:left-[40.1%] xl:top-[4cqw] xl:w-[46cqw] xl:p-0">
          <motion.div {...reveal(0, 8)} className="flex items-center gap-4 xl:gap-[1.8cqw]" style={{ color: GOLD }}>
            <span className="whitespace-nowrap text-[11px] uppercase leading-none tracking-[0.3em] xl:text-[0.9cqw]">
              {t('iftar.kicker')}
            </span>
            <span className="h-px w-[60px] shrink-0 xl:w-[9.4cqw]" style={{ backgroundColor: RULE }} />
          </motion.div>

          <motion.h2
            {...reveal(0.05, 16)}
            className="mt-4 font-display text-[clamp(2.4rem,11cqw,3.6rem)] font-normal leading-[1.05] tracking-[-0.02em] sm:text-[3.6rem] xl:mt-[1.6cqw] xl:text-[4.25cqw]"
          >
            {t('iftar.title')}
          </motion.h2>

          <motion.p
            {...reveal(0.15)}
            className="mt-4 max-w-[34rem] text-[15px] font-light leading-[1.62] sm:mt-5 sm:text-[17px] xl:mt-[1.7cqw] xl:max-w-[32cqw] xl:text-[1.2cqw] xl:leading-[1.6] xl:tracking-[0.01em]"
            style={{ color: BODY }}
          >
            {t('iftar.body')}
          </motion.p>

          <motion.div {...reveal(0.25)} className="mt-7 xl:mt-[2.2cqw]">
            <a
              href="#menu-builder"
              className="group inline-flex h-[52px] items-center gap-6 px-8 shadow-[0_16px_30px_-20px_rgba(30,35,15,0.8)] transition-[background-color,transform] duration-300 active:scale-[0.98] xl:h-[3.15cqw] xl:gap-[2.4cqw] xl:px-[2.3cqw]"
              style={{ backgroundColor: BTN, color: BTN_TEXT }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN)}
            >
              <span className="whitespace-nowrap text-[12px] font-normal uppercase leading-none tracking-[0.22em] xl:text-[0.95cqw]">
                {t('iftar.cta')}
              </span>
              <svg
                viewBox="0 0 128 128"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 xl:h-[1.4cqw] xl:w-[1.4cqw]"
              >
                <path d="M14 64h100m-25-24 25 24-25 24" />
              </svg>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
