'use client';

import { useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

const baseServices = [
  { id: 'corporate', image: '/service1.jpg' },
  { id: 'wedding', image: '/service2.jpg' },
  { id: 'event', image: '/service3.jpg' },
];

export default function Services() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const middleY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const rightY = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -120]);

  const cards = useMemo(() => {
    const copy = t('services.cards') as Record<string, { title: string; description: string }>;
    return baseServices.map((service) => ({
      ...service,
      title: copy?.[service.id]?.title ?? '',
      description: copy?.[service.id]?.description ?? '',
    }));
  }, [t]);

  return (
    <section id="services" className="py-20 md:py-28 bg-[#ebe6dc] text-[#1f1f1f]" ref={sectionRef}>
      <div className="max-w-[90rem] mx-auto px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#6c655b]">{t('services.kicker')}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-[0.06em] leading-tight">
            {t('services.title')}
          </h2>
          <p className="text-base md:text-lg text-[#4a4742] max-w-4xl mx-auto leading-relaxed">
            {t('services.subtext')}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          {cards.map((service, index) => {
            const y = index === 0 ? 0 : index === 1 ? middleY : rightY;
            return (
              <motion.div
                key={service.id}
                style={{ y: index === 0 ? undefined : y }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#d9d0c3] mb-6">
                  <Image src={service.image} alt={service.title} fill className="object-cover" priority />
                </div>
                <h3 className="text-lg md:text-xl font-serif uppercase tracking-[0.06em] text-center mb-4">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-[#4a4742] leading-relaxed text-center mb-6 px-2">
                  {service.description}
                </p>
                <div className="flex flex-col items-center gap-2 mt-auto">
                  <a
                    href="#menu-builder"
                    className="text-xs uppercase tracking-[0.22em] text-[#1f1f1f] hover:opacity-70 transition-opacity"
                  >
                    {t('services.cta')}
                  </a>
                  <div className="w-10 h-px bg-[#c7b9a5]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
