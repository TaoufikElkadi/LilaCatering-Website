'use client';

import { motion } from 'framer-motion';
import { memo, useState, useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal } from './MenuDecor';

interface DatePickerSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

function DatePickerSelector({ selectedDate, onDateChange }: DatePickerSelectorProps) {
  const { t, lang } = useLanguage();

  const [tempDate, setTempDate] = useState(selectedDate);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    // showPicker() is the modern way; fall back to focus()/click().
    if (typeof el.showPicker === 'function') {
      try {
        el.showPicker();
        return;
      } catch {
        /* not allowed in this context — fall through */
      }
    }
    el.focus();
    el.click();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get maximum date (2 years from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleDateChange = (date: string) => {
    setTempDate(date);
    onDateChange(date);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const locale = lang === 'nl' ? 'nl-NL' : lang === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-12 px-4 sm:px-6 overflow-x-hidden">
      <StepHeader title={t('menuBuilder.datePicker.title')} subtitle={t('menuBuilder.datePicker.subtitle')} />

      <div className="max-w-2xl mx-auto w-full">
        {/* Date Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-[3px] border border-[#e7ddcb] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] shadow-[0_16px_44px_-22px_rgba(80,60,30,0.34)] p-5 sm:p-10 md:p-12"
        >
          {/* inset gold hairline + corner ornament */}
          <span className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-[#C19A5B]/25" />
          <StarSeal className="pointer-events-none absolute -top-5 -right-5 w-28 h-28 text-[#C19A5B]/[0.05]" />

          <div className="relative flex flex-col items-center gap-8">
            {/* Date Input — proper field: calendar icon + value, click anywhere opens the picker */}
            <div className="w-full min-w-0">
              <label className="flex items-center justify-center gap-3 text-[11px] tracking-[0.28em] text-[#a8824a] mb-4 text-center uppercase">
                <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
                {t('menuBuilder.datePicker.selectLabel')}
                <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
              </label>
              <div
                onClick={openPicker}
                className="group/date relative flex items-center gap-3 w-full max-w-md mx-auto bg-white border border-[#dcc8a4] focus-within:border-[#C19A5B] focus-within:ring-2 focus-within:ring-[#C19A5B]/20 rounded-[3px] px-4 py-3.5 cursor-pointer transition-all duration-300 hover:border-[#C19A5B]"
              >
                <CalendarDays className="w-5 h-5 shrink-0 text-[#C19A5B]" strokeWidth={1.75} />
                <input
                  ref={inputRef}
                  type="date"
                  min={today}
                  max={maxDateStr}
                  value={tempDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="date-field flex-1 min-w-0 bg-transparent text-left text-base sm:text-lg font-serif text-[#1f1f1f] outline-none cursor-pointer"
                />
              </div>
              <p className="text-xs text-[#9a8a6a] mt-4 text-center">{t('menuBuilder.datePicker.inputHint')}</p>
            </div>

            {/* Display Selected Date */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-6 border-t border-[#e7ddcb] w-full"
              >
                <p className="text-[11px] tracking-[0.28em] text-[#a8824a] uppercase mb-2">{t('menuBuilder.datePicker.yourDate')}</p>
                <p className="text-lg font-serif text-[#1f1f1f] tracking-[0.06em]">{formatDisplayDate(selectedDate)}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] text-[#8a8275] tracking-[0.22em] font-light uppercase">
            {t('menuBuilder.datePicker.recommendation')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(DatePickerSelector);

