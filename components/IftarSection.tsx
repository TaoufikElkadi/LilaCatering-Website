'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StarSeal } from './MenuDecor';

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

// Photos are warm placeholders — swap for the generated iftar shots.
const MAIN_IMG = '/images/iftar/iftar-dish.jpg';
const SIDE_IMG = '/images/iftar/iftar-table.jpg';

// Moorish onion / ogee arch (objectBoundingBox units).
const ARCH_PATH =
  'M0,1 L0,0.52 C0,0.33 0.15,0.28 0.29,0.33 C0.42,0.37 0.46,0.16 0.5,0 C0.54,0.16 0.58,0.37 0.71,0.33 C0.85,0.28 1,0.33 1,0.52 L1,1 Z';

type IconProps = { className?: string };

/** Tagine silhouette. */
function TagineIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3c-3 0-5.1 3.9-5.7 8h11.4C17.1 6.9 15 3 12 3Z" />
      <circle cx="12" cy="3.1" r="0.5" fill="currentColor" stroke="none" />
      <path d="M4.5 11h15" />
      <path d="M6 11c0 2 2.4 3.3 6 3.3s6-1.3 6-3.3" />
    </svg>
  );
}

/** Community / gathering. */
function CommunityIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8" r="2.3" />
      <circle cx="15.8" cy="9" r="1.9" />
      <path d="M4.2 18c0-2.9 1.9-4.6 4.3-4.6s4.3 1.7 4.3 4.6" />
      <path d="M14.4 13.6c2.1 0 3.9 1.4 3.9 4.1" />
    </svg>
  );
}

/** Location pin. */
function PinIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21c4-4.6 6.4-7.8 6.4-11A6.4 6.4 0 1 0 5.6 10c0 3.2 2.4 6.4 6.4 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

const FEATURE_ICONS = [TagineIcon, CommunityIcon, PinIcon];

export default function IftarSection() {
  const { t } = useLanguage();
  const features = (t('iftar.features') as { title: string; text: string }[]) ?? [];
  const [word1, ...rest] = t('iftar.title').split(' ');
  const word2 = rest.join(' ');

  return (
    <section id="iftar" className="relative overflow-hidden bg-[#f3ede1] text-[#2a2622] py-16 sm:py-20 lg:py-24">
      {/* Onion arch clip path */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="iftarArch" clipPathUnits="objectBoundingBox">
            <path d={ARCH_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Vertical side label + crescent (desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-between absolute left-6 xl:left-10 top-16 bottom-14 z-10">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-[0.45em] uppercase text-[#a8824a] font-light">
          {t('iftar.sideLabel')}
        </span>
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#b8905a]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M15 3a9 9 0 100 18 7.4 7.4 0 010-14.8A9.3 9.3 0 0015 3z" />
          <path d="M19.4 5.1l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="relative max-w-[90rem] mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <StarSeal className="w-6 h-6 text-[#b8905a]" />
              <span className="text-[12px] uppercase tracking-[0.42em] text-[#a8824a]">{t('iftar.kicker')}</span>
            </div>

            <h2 className="font-serif uppercase leading-[0.88] tracking-[0.04em] text-[3.4rem] sm:text-7xl lg:text-[5.6rem]">
              <span className="block text-[#2a2622]">{word1}</span>
              <span className="block text-[#b8905a]">{word2}</span>
            </h2>

            {/* Divider with diamond */}
            <div className="flex items-center gap-3 mt-6 mb-8">
              <span className="h-px w-24 bg-[#c19a5b]" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#b8905a]" />
              <span className="h-px w-14 bg-gradient-to-r from-[#c19a5b] to-transparent" />
            </div>

            <p className="text-[15px] sm:text-base text-[#4a4742] leading-[1.75] max-w-[34rem]">
              {t('iftar.body')}
            </p>

            <ul className="mt-8 space-y-3 max-w-[31rem]">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? TagineIcon;
                return (
                  <li key={i} className="flex items-center gap-5 border-b border-[#e2d7c3] last:border-0 py-3">
                    <span className="flex items-center justify-center w-[52px] h-[52px] shrink-0 rounded-full border border-[#d8c39a] text-[#b8905a]">
                      <Icon className="w-[22px] h-[22px]" />
                    </span>
                    <div className="flex-1">
                      <p className="text-[12px] uppercase tracking-[0.2em] text-[#2a2622] font-semibold">{f.title}</p>
                      <p className="text-[13px] text-[#6c655b] mt-1 leading-relaxed">{f.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Gold plaque CTA with arrow */}
            <a
              href="#menu-builder"
              className="group relative mt-9 inline-flex items-center w-[24rem] max-w-full h-[62px] rounded-[16px] bg-gradient-to-b from-[#c6a361] via-[#b8905a] to-[#a67e46] shadow-[0_16px_38px_-16px_rgba(150,110,55,0.85)] hover:shadow-[0_20px_46px_-16px_rgba(150,110,55,1)] transition-shadow"
            >
              <span className="relative flex-1 text-center pl-6 pr-14 text-[13px] uppercase tracking-[0.2em] text-[#fdf6e6]">
                {t('iftar.cta')}
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full border border-white/50 text-[#fdf6e6]">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.8} />
              </span>
            </a>
          </motion.div>

          {/* Image composition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2 relative w-full max-w-lg mx-auto lg:max-w-none aspect-[4/5] sm:aspect-[5/5] lg:aspect-[7/8]"
          >
            {/* Decorative faint circle + mandala star */}
            <svg className="absolute left-[-6%] top-[26%] w-[52%] h-[62%] text-[#cbb083]/45" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" />
            </svg>
            <StarSeal className="absolute right-[8%] top-[6%] w-16 h-16 text-[#cbb083]/35" />

            {/* Main arch */}
            <div
              className="absolute left-[3%] top-[0%] w-[65%] h-[97%] bg-[#d8d2c6] drop-shadow-[0_30px_46px_rgba(80,60,30,0.32)]"
              style={{ clipPath: 'url(#iftarArch)' }}
            >
              <Image src={MAIN_IMG} alt="" fill className="object-cover" sizes="(max-width:1024px) 60vw, 34vw" quality={82} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>

            {/* Secondary arch with cream frame */}
            <div className="absolute right-[1%] top-[18%] w-[35%] h-[52%] bg-[#f7f2e9] p-[6px] drop-shadow-[0_22px_38px_rgba(80,60,30,0.34)]" style={{ clipPath: 'url(#iftarArch)' }}>
              <div className="relative w-full h-full bg-[#d8d2c6]" style={{ clipPath: 'url(#iftarArch)' }}>
                <Image src={SIDE_IMG} alt="" fill className="object-cover" sizes="(max-width:1024px) 30vw, 16vw" quality={82} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              </div>
            </div>

            {/* Note card */}
            <div className="absolute right-[1%] bottom-[3%] w-[38%] bg-[#f7f2e9] border border-[#e7ddcb] rounded-[10px] px-5 py-5 shadow-[0_18px_40px_-18px_rgba(80,60,30,0.42)]">
              <span className="flex items-center justify-center w-10 h-10 rounded-full border border-[#d8c39a] text-[#b8905a] mb-3">
                <Clock className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </span>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#a8824a] font-semibold">{t('iftar.noteTitle')}</p>
              <p className="text-[12px] text-[#6c655b] mt-1.5 leading-relaxed">{t('iftar.noteText')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
