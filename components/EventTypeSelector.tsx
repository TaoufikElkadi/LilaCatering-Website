'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader } from './MenuDecor';

export type EventType = 'wedding' | 'engagement' | 'henna' | 'birth' | 'other';

const EVENT_IMAGES: Record<EventType, string> = {
  wedding: '/images/menu-builder/event-wedding.jpg',
  engagement: '/images/menu-builder/event-engagement.jpg',
  henna: '/images/menu-builder/event-henna.jpg',
  birth: '/images/menu-builder/event-birth.jpg',
  other: '/images/menu-builder/event-other.jpg',
};

// Same gold as the header's Offerte CTA.
const GOLD = '#9E7F57';

interface EventTypeSelectorProps {
  selectedEventType: EventType | null;
  onEventTypeChange: (eventType: EventType) => void;
}

function EventTypeSelector({ selectedEventType, onEventTypeChange }: EventTypeSelectorProps) {
  const { t } = useLanguage();

  const eventTypeIds: EventType[] = ['wedding', 'engagement', 'henna', 'birth', 'other'];

  return (
    <div className="space-y-8 sm:space-y-9">
      <StepHeader title={t('menuBuilder.eventType.title')} subtitle={t('menuBuilder.eventType.subtitle')} />

      {/* Full-bleed photo cards: name bottom-left, radio bottom-right */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-[17px]">
        {eventTypeIds.map((id, index) => {
          const isSelected = selectedEventType === id;
          const name = t(`menuBuilder.eventType.types.${id}.name`);
          return (
            <motion.button
              key={id}
              type="button"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEventTypeChange(id)}
              aria-pressed={isSelected}
              whileHover={{ y: -4, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className={`group relative block aspect-[235/280] overflow-hidden rounded-[4px] text-left bg-[#3a2d22] shadow-[0_14px_30px_-20px_rgba(50,35,20,0.55)] outline-none transition-shadow duration-500 hover:shadow-[0_26px_50px_-24px_rgba(50,35,20,0.6)] focus-visible:ring-2 focus-visible:ring-[#9E7F57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5ece3] ${
                index === eventTypeIds.length - 1 ? 'col-span-2 sm:col-span-1 aspect-auto sm:aspect-[235/280] h-[220px] sm:h-auto' : ''
              }`}
            >
              <Image
                src={EVENT_IMAGES[id]}
                alt=""
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 via-[38%] to-transparent to-[62%]" />

              {/* Selected: gold inner frame */}
              <span
                className={`pointer-events-none absolute inset-0 rounded-[4px] border-2 transition-colors duration-300 ${
                  isSelected ? 'border-[#9E7F57]' : 'border-transparent'
                }`}
              />

              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-4 lg:px-3.5 min-[1440px]:px-5 pb-4 sm:pb-[17px]">
                <span className="font-display font-normal tracking-[0] min-w-0 text-[17px] lg:text-[15px] min-[1440px]:text-[17px] leading-[1.2] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
                  {name}
                </span>
                <span
                  className="mb-0.5 flex h-6 w-6 lg:h-5 lg:w-5 min-[1680px]:h-6 min-[1680px]:w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300"
                  style={
                    isSelected
                      ? { backgroundColor: GOLD, borderColor: GOLD }
                      : { borderColor: 'rgba(255,255,255,0.9)' }
                  }
                >
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                        className="flex"
                      >
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(EventTypeSelector);
