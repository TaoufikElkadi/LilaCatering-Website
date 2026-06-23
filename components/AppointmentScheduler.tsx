'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import type { Slot } from '@/lib/booking';

interface Props {
  offerteSummary: string;
}

const localeTag = (lang: string) => (lang === 'nl' ? 'nl-NL' : lang === 'fr' ? 'fr-FR' : 'en-US');

export default function AppointmentScheduler({ offerteSummary }: Props) {
  const { t, lang } = useLanguage();
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  useEffect(() => {
    let active = true;
    fetch('/api/appointments/availability')
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setSlots(Array.isArray(d.slots) ? d.slots : []);
      })
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, []);

  // Group slots by date, preserving order.
  const byDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    (slots ?? []).forEach((s) => {
      const arr = map.get(s.date) ?? [];
      arr.push(s);
      map.set(s.date, arr);
    });
    return map;
  }, [slots]);

  const dates = useMemo(() => Array.from(byDate.keys()), [byDate]);

  const fmtDate = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString(localeTag(lang), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  const submit = async () => {
    if (!selected || !name || !email) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, startISO: selected.startISO, offerteSummary }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-serif text-[#1f1f1f] mb-2">{t('menuBuilder.booking.scheduler.success')}</p>
        <p className="text-sm text-[#6c655b]">{t('menuBuilder.booking.scheduler.successDesc')}</p>
      </div>
    );
  }

  if (loadError) {
    return <p className="text-sm text-[#8a8275] text-center py-6">{t('menuBuilder.booking.scheduler.error')}</p>;
  }

  if (slots === null) {
    return <p className="text-sm text-[#8a8275] text-center py-6">…</p>;
  }

  if (slots.length === 0) {
    return <p className="text-sm text-[#8a8275] text-center py-6">{t('menuBuilder.booking.scheduler.noSlots')}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div>
        <p className="text-[11px] tracking-[0.28em] text-[#a8824a] uppercase mb-3 text-center">
          {t('menuBuilder.booking.scheduler.pickDate')}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDate(d);
                setSelected(null);
              }}
              className={`border-[1.5px] px-4 py-2 text-[13px] tracking-[0.02em] transition-colors ${
                selectedDate === d
                  ? 'border-[#C19A5B] bg-[#C19A5B]/[0.08] text-[#1f1f1f] font-medium'
                  : 'border-[#e0d3b8] bg-white/50 text-[#4a443b] hover:border-[#cdb589]'
              }`}
            >
              {fmtDate(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Time picker */}
      {selectedDate && (
        <div>
          <p className="text-[11px] tracking-[0.28em] text-[#a8824a] uppercase mb-3 text-center">
            {t('menuBuilder.booking.scheduler.pickTime')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(byDate.get(selectedDate) ?? []).map((s) => (
              <button
                key={s.startISO}
                onClick={() => setSelected(s)}
                className={`border-[1.5px] px-4 py-2 text-sm tabular-nums transition-colors ${
                  selected?.startISO === s.startISO
                    ? 'border-[#C19A5B] bg-[#C19A5B]/[0.08] text-[#1f1f1f] font-medium'
                    : 'border-[#e0d3b8] bg-white/50 text-[#4a443b] hover:border-[#cdb589]'
                }`}
              >
                {s.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contact + confirm */}
      {selected && (
        <div className="max-w-md mx-auto space-y-3 pt-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('menuBuilder.booking.form.name')}
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('menuBuilder.booking.form.email')}
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('menuBuilder.booking.form.phone')}
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]"
          />
          {status === 'error' && (
            <p className="text-xs text-[#b4493f]">{t('menuBuilder.booking.scheduler.error')}</p>
          )}
          <button
            onClick={submit}
            disabled={!name || !email || status === 'submitting'}
            className="w-full min-h-[52px] bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] text-[#1f1f1f] text-sm uppercase tracking-[0.2em] font-medium rounded-[3px] disabled:opacity-50 transition-opacity"
          >
            {status === 'submitting'
              ? t('menuBuilder.booking.form.submitting')
              : t('menuBuilder.booking.scheduler.confirm')}
          </button>
        </div>
      )}
    </div>
  );
}
