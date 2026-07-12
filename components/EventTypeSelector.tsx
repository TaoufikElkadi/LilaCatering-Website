'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, Utensils, Sparkles, Gem, CalendarCheck, type LucideIcon } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal } from './MenuDecor';

export type EventType = 'wedding' | 'engagement' | 'henna' | 'birth' | 'other';

const EVENT_IMAGES: Record<EventType, string> = {
  wedding: '/images/decorations/grace.jpg',
  engagement: '/images/decorations/beldi.jpg',
  henna: '/images/decorations/royal.jpg',
  birth: '/images/decorations/classic.jpg',
  other: '/images/decorations/royalgreen.jpg',
};

const FEATURES: { id: string; Icon: LucideIcon }[] = [
  { id: 'advies', Icon: Utensils },
  { id: 'compleet', Icon: Sparkles },
  { id: 'opmaat', Icon: Gem },
  { id: 'zorgeloos', Icon: CalendarCheck },
];

interface EventTypeSelectorProps {
  selectedEventType: EventType | null;
  onEventTypeChange: (eventType: EventType) => void;
}

function EventTypeSelector({ selectedEventType, onEventTypeChange }: EventTypeSelectorProps) {
  const { t } = useLanguage();

  const eventTypeIds: EventType[] = ['wedding', 'engagement', 'henna', 'birth', 'other'];

  return (
    <div className="space-y-12">
      <StepHeader title={t('menuBuilder.eventType.title')} subtitle={t('menuBuilder.eventType.subtitle')} />

      {/* Break out wider than the builder's max-w-6xl so the cards read as
          landscape (near-square photo + panel), matching the design. */}
      <div className="relative sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[min(94vw,1440px)] space-y-12">

      {/* Event Type Cards — image left + ivory panel right; 3 on top, 2 centered */}
      <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
        {eventTypeIds.map((id, index) => {
          const isSelected = selectedEventType === id;
          return (
            <motion.button
              key={id}
              type="button"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              onClick={() => onEventTypeChange(id)}
              className={`group block w-full lg:w-[calc(33.333%-1rem)] text-left transition-[padding] duration-300 ${
                isSelected ? 'p-1.5 bg-[#C19A5B]' : 'p-0'
              }`}
            >
              <div
                className={`grid grid-cols-1 sm:grid-cols-[46%_1fr] h-full bg-[#faf6ee] transition-shadow duration-500 ${
                  isSelected
                    ? 'shadow-[0_24px_60px_-26px_rgba(120,90,40,0.55)]'
                    : 'border border-[#e2d8c5] shadow-[0_12px_32px_-22px_rgba(60,45,25,0.3)] group-hover:border-[#d0bd94] group-hover:shadow-[0_22px_54px_-26px_rgba(80,60,30,0.4)]'
                }`}
              >
                {/* Photo */}
                <div className="relative min-h-[230px] overflow-hidden bg-[#d8d2c6]">
                  <Image
                    src={EVENT_IMAGES[id]}
                    alt={t(`menuBuilder.eventType.types.${id}.name`)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 45vw, 18vw"
                  />
                </div>

                {/* Detail panel */}
                <div className="flex flex-col px-5 sm:px-6 py-6">
                  <span className="text-[11px] tracking-[0.3em] text-[#b39256]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="mt-2 text-lg sm:text-xl font-serif font-light tracking-[0.06em] text-[#1f1f1f] uppercase leading-tight">
                    {t(`menuBuilder.eventType.types.${id}.name`)}
                  </h4>
                  <div
                    className={`mt-3 h-px bg-gradient-to-r from-[#C19A5B] to-transparent transition-all duration-500 ${
                      isSelected ? 'w-20' : 'w-10 group-hover:w-20'
                    }`}
                  />
                  <p className="mt-4 text-[13px] text-[#5f584d] leading-relaxed font-light">
                    {t(`menuBuilder.eventType.types.${id}.description`)}
                  </p>

                  <p className="mt-5 pb-3 border-b border-[#e7ddcb] text-[10px] uppercase tracking-[0.22em] text-[#8a8275]">
                    {t(`menuBuilder.eventType.types.${id}.requirements`)}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-[11px] tracking-[0.24em] uppercase transition-colors ${
                        isSelected ? 'text-[#1f1f1f] font-medium' : 'text-[#8a8275] group-hover:text-[#1f1f1f]'
                      }`}
                    >
                      {t('menuBuilder.eventType.select')}
                    </span>
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#C19A5B] border-[#C19A5B] text-white'
                          : 'border-[#d6c39d] text-transparent group-hover:border-[#C19A5B]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Reassurance band */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 border border-[#e2d8c5] bg-[#faf6ee]/60 px-6 sm:px-8 py-8">
        {FEATURES.map(({ id, Icon }, i) => (
          <div
            key={id}
            className={`flex items-start gap-4 px-2 sm:px-6 ${
              i !== 0 ? 'lg:border-l lg:border-[#e2d8c5]' : ''
            }`}
          >
            <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full border border-[#d6c39d] text-[#C19A5B]">
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <div className="space-y-1">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#a8824a]">
                {t(`menuBuilder.eventType.features.${id}.title`)}
              </p>
              <p className="text-[12px] leading-relaxed text-[#6c655b] font-light">
                {t(`menuBuilder.eventType.features.${id}.text`)}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default memo(EventTypeSelector);
