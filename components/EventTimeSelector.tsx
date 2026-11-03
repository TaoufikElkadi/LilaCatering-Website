'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { Clock, UtensilsCrossed, Moon, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal } from './MenuDecor';

interface EventTimeSelectorProps {
  eventStart: string;
  eventEnd: string;
  foodTime: string;
  onEventStartChange: (v: string) => void;
  onEventEndChange: (v: string) => void;
  onFoodTimeChange: (v: string) => void;
}

function EventTimeSelector({
  eventStart,
  eventEnd,
  foodTime,
  onEventStartChange,
  onEventEndChange,
  onFoodTimeChange,
}: EventTimeSelectorProps) {
  const { t } = useLanguage();

  const fields = [
    { Icon: Clock, label: t('menuBuilder.eventTime.startLabel'), value: eventStart, onChange: onEventStartChange },
    { Icon: UtensilsCrossed, label: t('menuBuilder.eventTime.foodLabel'), value: foodTime, onChange: onFoodTimeChange },
    { Icon: Moon, label: t('menuBuilder.eventTime.endLabel'), value: eventEnd, onChange: onEventEndChange },
  ];

  return (
    <div className="space-y-12 px-4 sm:px-6 overflow-x-hidden">
      <StepHeader title={t('menuBuilder.eventTime.title')} subtitle={t('menuBuilder.eventTime.subtitle')} />

      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-[3px] border border-[#e7ddcb] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] shadow-[0_16px_44px_-22px_rgba(80,60,30,0.34)] p-5 sm:p-10 md:p-12"
        >
          <span className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-[#C19A5B]/25" />
          <StarSeal className="pointer-events-none absolute -top-5 -right-5 w-28 h-28 text-[#C19A5B]/[0.05]" />

          <div className="relative grid gap-5 sm:gap-6">
            {fields.map(({ Icon, label, value, onChange }) => (
              <label key={label} className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-[11px] tracking-[0.24em] text-[#a8824a] uppercase">
                  <Icon className="w-3.5 h-3.5 text-[#C19A5B]" strokeWidth={1.75} />
                  {label}
                </span>
                <div className="relative flex items-center bg-white border border-[#dcc8a4] focus-within:border-[#C19A5B] focus-within:ring-2 focus-within:ring-[#C19A5B]/20 rounded-[3px] px-4 py-3 transition-all duration-300 hover:border-[#C19A5B]">
                  <input
                    type="time"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="time-field flex-1 min-w-0 bg-transparent text-base sm:text-lg font-serif text-[#1f1f1f] outline-none cursor-pointer"
                  />
                  {/* a filled-in time is confirmed with a small check */}
                  <AnimatePresence initial={false}>
                    {value && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                        className="ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9E7F57] text-white"
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </label>
            ))}
          </div>

          <p className="relative text-xs text-[#9a8a6a] mt-6 text-center">{t('menuBuilder.eventTime.note')}</p>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(EventTimeSelector);
