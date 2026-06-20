'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export type EventType = 'wedding' | 'engagement' | 'henna' | 'birth' | 'other';

interface EventTypeSelectorProps {
  selectedEventType: EventType | null;
  onEventTypeChange: (eventType: EventType) => void;
}

function EventTypeSelector({ selectedEventType, onEventTypeChange }: EventTypeSelectorProps) {
  const { t } = useLanguage();

  if (!onEventTypeChange) {
    console.error('EventTypeSelector: onEventTypeChange is required');
    return null;
  }

  const eventTypeIds: EventType[] = ['wedding', 'engagement', 'henna', 'birth', 'other'];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-light mb-3 tracking-[0.08em] text-[#1f1f1f] uppercase">
          {t('menuBuilder.eventType.title')}
        </h3>
        <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">
          {t('menuBuilder.eventType.subtitle')}
        </p>
      </div>

      {/* Event Type Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {eventTypeIds.map((eventTypeId, index) => {
          const isSelected = selectedEventType === eventTypeId;
          return (
            <motion.div
              key={eventTypeId}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onEventTypeChange(eventTypeId)}
              className="group relative cursor-pointer"
            >
              <div
                className={`relative h-full overflow-hidden rounded-[3px] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] p-7 sm:p-8 transition-[box-shadow,border-color] duration-500 ${
                  isSelected
                    ? 'border border-[#C19A5B] shadow-[0_22px_56px_-22px_rgba(120,90,40,0.5)]'
                    : 'border border-[#e7ddcb] shadow-[0_10px_30px_-18px_rgba(60,45,25,0.28)] group-hover:border-[#d6c39d] group-hover:shadow-[0_24px_58px_-24px_rgba(80,60,30,0.38)]'
                }`}
              >
                {/* inset gold hairline frame */}
                <div
                  className={`pointer-events-none absolute inset-[6px] rounded-[2px] border transition-opacity duration-500 ${
                    isSelected
                      ? 'border-[#C19A5B]/55 opacity-100'
                      : 'border-[#C19A5B]/0 opacity-0 group-hover:border-[#C19A5B]/30 group-hover:opacity-100'
                  }`}
                />
                <div className="relative space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[#b39256]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-xl font-serif font-light tracking-[0.05em] text-[#1f1f1f] leading-tight">
                    {t(`menuBuilder.eventType.types.${eventTypeId}.name`)}
                  </h4>
                  <div
                    className={`h-px bg-gradient-to-r from-[#C19A5B] to-transparent transition-all duration-500 ${
                      isSelected ? 'w-20' : 'w-10 group-hover:w-20'
                    }`}
                  />
                  <p className="text-[13px] text-[#6c655b] leading-relaxed font-light">
                    {t(`menuBuilder.eventType.types.${eventTypeId}.description`)}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a8275] pt-1">
                    {t(`menuBuilder.eventType.types.${eventTypeId}.requirements`)}
                  </p>
                </div>

                {/* Selection indicator */}
                <div className="relative flex items-center justify-between pt-5 mt-6 border-t border-[#e7ddcb]">
                  <span
                    className={`text-[11px] tracking-[0.24em] uppercase transition-colors ${
                      isSelected ? 'text-[#1f1f1f] font-medium' : 'text-[#8a8275] group-hover:text-[#1f1f1f]'
                    }`}
                  >
                    {isSelected ? t('menuBuilder.eventType.selected') : t('menuBuilder.eventType.select')}
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(EventTypeSelector);
