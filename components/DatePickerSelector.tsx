'use client';

import { motion } from 'framer-motion';
import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal } from './MenuDecor';

interface DatePickerSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const localeTag = (lang: string) => (lang === 'nl' ? 'nl-NL' : lang === 'fr' ? 'fr-FR' : 'en-US');

const pad = (n: number) => String(n).padStart(2, '0');
const toStr = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

interface Availability {
  counts: Record<string, number>;
  capacity: number;
}

function DatePickerSelector({ selectedDate, onDateChange }: DatePickerSelectorProps) {
  const { t, lang } = useLanguage();
  const locale = localeTag(lang);

  const [avail, setAvail] = useState<Availability | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/event-availability')
      .then((r) => r.json())
      .then((d) => {
        if (active) setAvail({ counts: d.counts ?? {}, capacity: d.capacity ?? 2 });
      })
      .catch(() => active && setAvail({ counts: {}, capacity: 2 }));
    return () => {
      active = false;
    };
  }, []);

  // Bounds: from today to 12 months out (browser-local calendar dates).
  const now = useMemo(() => new Date(), []);
  const todayStr = toStr(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = useMemo(() => {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [now]);
  const maxStr = toStr(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

  // Visible month — initialise on the selected date if any, else this month.
  const initial = selectedDate ? new Date(selectedDate + 'T12:00:00') : now;
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });

  const atMinMonth = view.year === now.getFullYear() && view.month === now.getMonth();
  const atMaxMonth = view.year === maxDate.getFullYear() && view.month === maxDate.getMonth();

  const prevMonth = useCallback(() => {
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));
  }, []);
  const nextMonth = useCallback(() => {
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));
  }, []);

  // Monday-first weekday headers, localized (2024-01-01 was a Monday).
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' })
      ),
    [locale]
  );

  // Build the grid for the current view month (Monday-first).
  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7; // 0 = Monday
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const out: (number | null)[] = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }, [view]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const formatDisplayDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const capacity = avail?.capacity ?? 2;

  return (
    <div className="space-y-12 px-4 sm:px-6 overflow-x-hidden">
      <StepHeader title={t('menuBuilder.datePicker.title')} subtitle={t('menuBuilder.datePicker.subtitle')} />

      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-[3px] border border-[#e7ddcb] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] shadow-[0_16px_44px_-22px_rgba(80,60,30,0.34)] p-5 sm:p-8 md:p-10"
        >
          <span className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-[#C19A5B]/25" />
          <StarSeal className="pointer-events-none absolute -top-5 -right-5 w-28 h-28 text-[#C19A5B]/[0.05]" />

          <div className="relative">
            <label className="flex items-center justify-center gap-3 text-[11px] tracking-[0.28em] text-[#a8824a] mb-6 text-center uppercase">
              <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
              {t('menuBuilder.datePicker.selectLabel')}
              <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
            </label>

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                disabled={atMinMonth}
                aria-label={t('menuBuilder.datePicker.prevMonth')}
                className="p-2 rounded-full text-[#C19A5B] hover:bg-[#C19A5B]/10 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <span className="text-base sm:text-lg font-serif text-[#1f1f1f] tracking-[0.04em] capitalize">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                disabled={atMaxMonth}
                aria-label={t('menuBuilder.datePicker.nextMonth')}
                className="p-2 rounded-full text-[#C19A5B] hover:bg-[#C19A5B]/10 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekdays.map((w, i) => (
                <div
                  key={i}
                  className="text-center text-[10px] tracking-[0.12em] text-[#a8824a] uppercase py-1"
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const dateStr = toStr(view.year, view.month, day);
                const outOfRange = dateStr < todayStr || dateStr > maxStr;
                const count = avail?.counts[dateStr] ?? 0;
                const remaining = capacity - count;
                const full = remaining <= 0;
                const oneLeft = remaining === 1;
                const disabled = outOfRange || full;
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onDateChange(dateStr)}
                    title={
                      full
                        ? t('menuBuilder.datePicker.fullyBooked')
                        : oneLeft
                        ? t('menuBuilder.datePicker.oneSpotLeft')
                        : undefined
                    }
                    className={[
                      'relative aspect-square flex items-center justify-center rounded-[3px] text-sm font-serif transition-all duration-200',
                      isSelected
                        ? 'bg-[#C19A5B] text-white shadow-[0_4px_14px_-4px_rgba(193,154,91,0.7)]'
                        : disabled
                        ? 'text-[#cdbfa6] cursor-not-allowed'
                        : 'text-[#1f1f1f] hover:bg-[#C19A5B]/15 hover:text-[#8a6a2f] cursor-pointer',
                    ].join(' ')}
                  >
                    {day}
                    {full && !outOfRange && !isSelected && (
                      <span className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-[#cdbfa6]/80" />
                    )}
                    {oneLeft && !isSelected && (
                      <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C19A5B]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 text-[10px] tracking-[0.12em] text-[#8a8275] uppercase">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C19A5B]" />
                {t('menuBuilder.datePicker.oneSpotLeft')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="relative w-3.5 h-3.5 inline-block">
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#cdbfa6]" />
                </span>
                {t('menuBuilder.datePicker.fullyBooked')}
              </span>
            </div>

            {/* Selected date */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-6 mt-6 border-t border-[#e7ddcb]"
              >
                <p className="text-[11px] tracking-[0.28em] text-[#a8824a] uppercase mb-2">
                  {t('menuBuilder.datePicker.yourDate')}
                </p>
                <p className="text-lg font-serif text-[#1f1f1f] tracking-[0.06em]">
                  {formatDisplayDate(selectedDate)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

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
