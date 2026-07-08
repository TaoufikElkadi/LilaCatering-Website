'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

// Iftar catering highlight. Photos are placeholders from the gallery — swap for
// dedicated iftar shots when available.
const IFTAR_IMAGES = ['/gallery/g-28.jpg', '/gallery/g-35.jpg', '/gallery/g-12.jpg'];

export default function IftarSection() {
  const { t } = useLanguage();
  const points = (t('iftar.points') as string[]) ?? [];

  return (
    <section id="iftar" className="py-12 sm:py-20 md:py-28 bg-[#f7f3ec] text-[#1f1f1f]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#a8824a] mb-3">
              {t('iftar.kicker')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-[0.05em] leading-tight mb-5">
              {t('iftar.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#4a4742] leading-relaxed mb-6 max-w-xl">
              {t('iftar.body')}
            </p>

            {Array.isArray(points) && points.length > 0 && (
              <ul className="space-y-2.5 mb-8">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#4a4742]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#C19A5B]" />
                    {p}
                  </li>
                ))}
              </ul>
            )}

            <a
              href="#menu-builder"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#1f1f1f] border-b border-[#C19A5B] pb-1 hover:text-[#a8824a] transition-colors"
            >
              {t('iftar.cta')}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#d9d0c3] row-span-2">
              <Image src={IFTAR_IMAGES[0]} alt="" fill className="object-cover" sizes="(max-width:1024px) 45vw, 22vw" quality={80} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>
            <div className="relative aspect-square overflow-hidden bg-[#d9d0c3]">
              <Image src={IFTAR_IMAGES[1]} alt="" fill className="object-cover" sizes="(max-width:1024px) 45vw, 22vw" quality={80} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>
            <div className="relative aspect-square overflow-hidden bg-[#d9d0c3]">
              <Image src={IFTAR_IMAGES[2]} alt="" fill className="object-cover" sizes="(max-width:1024px) 45vw, 22vw" quality={80} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
