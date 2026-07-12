'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Users, MapPin, Clock, type LucideIcon } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StarSeal, StarDivider } from './MenuDecor';

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

// Photos are placeholders — swap for dedicated iftar shots when available.
const MAIN_IMG = '/images/decorations/beldi.jpg';
const SIDE_IMG = '/images/decorations/royal.jpg';
const DATES_IMG = '/images/dishes/lila-beldi-variety.jpg';

const FEATURE_ICONS: LucideIcon[] = [UtensilsCrossed, Users, MapPin];

export default function IftarSection() {
  const { t } = useLanguage();
  const features = (t('iftar.features') as { title: string; text: string }[]) ?? [];
  const [word1, ...rest] = t('iftar.title').split(' ');
  const word2 = rest.join(' ');

  return (
    <section id="iftar" className="relative overflow-hidden bg-[#f7f3ec] text-[#1f1f1f] py-16 sm:py-24">
      {/* Arch clip-path definition */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="iftarArch" clipPathUnits="objectBoundingBox">
            <path d="M0,1 L0,0.46 Q0,0.06 0.5,0 Q1,0.06 1,0.46 L1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Vertical side label + crescent (desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-between absolute left-6 xl:left-10 top-16 bottom-16 z-10">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-[0.4em] uppercase text-[#a8824a] font-light">
          {t('iftar.sideLabel')}
        </span>
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#C19A5B]" fill="currentColor" aria-hidden="true">
          <path d="M15 2a10 10 0 100 20 8 8 0 010-16 6 6 0 00.9.03A10 10 0 0015 2z" />
          <path d="M19.5 5.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" />
        </svg>
      </div>

      <div className="max-w-[88rem] mx-auto px-6 sm:px-10 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <StarSeal className="w-5 h-5 text-[#C19A5B]" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#a8824a]">{t('iftar.kicker')}</span>
            </div>

            <h2 className="font-serif uppercase leading-[0.95] tracking-[0.02em] text-5xl sm:text-6xl lg:text-7xl">
              <span className="block text-[#1f1f1f]">{word1}</span>
              <span className="block text-[#b8905a]">{word2}</span>
            </h2>

            <div className="my-7"><StarDivider className="justify-start" /></div>

            <p className="text-[15px] sm:text-base text-[#4a4742] leading-relaxed max-w-xl">
              {t('iftar.body')}
            </p>

            <ul className="mt-8 space-y-5">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? UtensilsCrossed;
                return (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-[#e0d2b4] bg-[#faf6ee] text-[#C19A5B]">
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                    </span>
                    <div className="pt-0.5 border-b border-[#e7ddcb] pb-4 flex-1">
                      <p className="text-[12px] uppercase tracking-[0.18em] text-[#1f1f1f] font-medium">{f.title}</p>
                      <p className="text-[13px] text-[#6c655b] mt-1 leading-relaxed">{f.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <a
              href="#menu-builder"
              className="group mt-9 inline-flex items-center justify-between gap-6 bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] text-white px-8 py-4 text-[11px] uppercase tracking-[0.24em] shadow-[0_16px_38px_-16px_rgba(193,154,91,0.8)] hover:shadow-[0_20px_46px_-16px_rgba(193,154,91,0.95)] transition-shadow"
            >
              {t('iftar.cta')}
              <StarSeal className="w-4 h-4 text-white/90 group-hover:rotate-45 transition-transform duration-500" />
            </a>
          </motion.div>

          {/* Image composition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2 relative w-full max-w-md mx-auto lg:max-w-none aspect-[5/6] sm:aspect-[6/5]"
          >
            {/* Decorative arch outline */}
            <svg className="absolute -top-4 right-4 w-40 h-52 text-[#d8c39a]/60 hidden sm:block" viewBox="0 0 100 130" fill="none" aria-hidden="true">
              <path d="M4,128 L4,54 Q4,10 50,2 Q96,10 96,54 L96,128" stroke="currentColor" strokeWidth="1" />
            </svg>

            {/* Main arch */}
            <div className="absolute left-0 top-[4%] w-[70%] h-[84%] bg-[#d8d2c6] drop-shadow-[0_24px_40px_rgba(80,60,30,0.28)]" style={{ clipPath: 'url(#iftarArch)' }}>
              <Image src={MAIN_IMG} alt="" fill className="object-cover" sizes="(max-width:1024px) 55vw, 30vw" quality={82} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>

            {/* Secondary arch */}
            <div className="absolute right-[1%] top-[15%] w-[40%] h-[48%] bg-[#d8d2c6] drop-shadow-[0_18px_34px_rgba(80,60,30,0.3)]" style={{ clipPath: 'url(#iftarArch)' }}>
              <Image src={SIDE_IMG} alt="" fill className="object-cover" sizes="(max-width:1024px) 30vw, 16vw" quality={82} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>

            {/* Dates square */}
            <div className="absolute left-[6%] bottom-0 w-[32%] aspect-square overflow-hidden bg-[#d8d2c6] shadow-[0_16px_34px_-12px_rgba(80,60,30,0.45)] ring-1 ring-white/60">
              <Image src={DATES_IMG} alt="" fill className="object-cover" sizes="18vw" quality={80} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>

            {/* Note card */}
            <div className="absolute right-0 bottom-[4%] w-[46%] bg-[#faf6ee] border border-[#e2d8c5] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_18px_40px_-18px_rgba(80,60,30,0.4)]">
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[#e0d2b4] text-[#C19A5B] mb-2.5">
                <Clock className="w-4 h-4" strokeWidth={1.6} />
              </span>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a8824a] font-medium">{t('iftar.noteTitle')}</p>
              <p className="text-[11px] sm:text-[12px] text-[#6c655b] mt-1 leading-relaxed">{t('iftar.noteText')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
