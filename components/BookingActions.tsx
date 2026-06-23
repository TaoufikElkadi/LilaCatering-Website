'use client';

import { useState } from 'react';
import { CalendarCheck, CreditCard } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { formatEuro } from '@/lib/pricing';
import { getDepositAmount } from '@/lib/booking';
import AppointmentScheduler from './AppointmentScheduler';

interface Props {
  totalPrice: number;
  eventDate: string;
  eventType: string;
  guestCount: number;
  offerteSummary: string;
}

export default function BookingActions({ totalPrice, eventDate, eventType, guestCount, offerteSummary }: Props) {
  const { t, lang } = useLanguage();
  const [mode, setMode] = useState<'choose' | 'reserve' | 'appointment'>('choose');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'unavailable'>('idle');

  const deposit = getDepositAmount(totalPrice);

  const startPayment = async () => {
    if (!name || !email) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPrice,
          eventDate,
          eventType,
          guestCount,
          customer: { name, email, phone },
          summary: offerteSummary,
          lang,
        }),
      });
      if (res.status === 503) {
        setStatus('unavailable');
        return;
      }
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mt-8 sm:mt-12 border-t border-[#dcd3c5] pt-8 sm:pt-12">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#1f1f1f] mb-2 sm:mb-3">
          {t('menuBuilder.booking.sectionTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-[#6c655b] max-w-xl mx-auto px-2">
          {t('menuBuilder.booking.sectionSubtitle')}
        </p>
      </div>

      {mode === 'choose' && (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
          <button
            onClick={() => setMode('reserve')}
            className="group text-left border-[1.5px] border-[#e0d3b8] bg-white/50 hover:border-[#C19A5B] p-6 rounded-[3px] transition-colors"
          >
            <CreditCard className="w-6 h-6 text-[#C19A5B] mb-3" strokeWidth={1.5} />
            <h4 className="text-lg font-serif text-[#1f1f1f] mb-1.5">{t('menuBuilder.booking.reserve.title')}</h4>
            <p className="text-[13px] text-[#6c655b] leading-relaxed">{t('menuBuilder.booking.reserve.desc')}</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#a8824a]">
              {t('menuBuilder.booking.reserve.depositNote')} · {formatEuro(deposit)}
            </p>
          </button>

          <button
            onClick={() => setMode('appointment')}
            className="group text-left border-[1.5px] border-[#e0d3b8] bg-white/50 hover:border-[#C19A5B] p-6 rounded-[3px] transition-colors"
          >
            <CalendarCheck className="w-6 h-6 text-[#C19A5B] mb-3" strokeWidth={1.5} />
            <h4 className="text-lg font-serif text-[#1f1f1f] mb-1.5">{t('menuBuilder.booking.appointment.title')}</h4>
            <p className="text-[13px] text-[#6c655b] leading-relaxed">{t('menuBuilder.booking.appointment.desc')}</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#a8824a]">
              {t('menuBuilder.booking.appointment.openButton')}
            </p>
          </button>
        </div>
      )}

      {mode === 'reserve' && (
        <div className="max-w-md mx-auto space-y-3">
          <button onClick={() => setMode('choose')} className="text-[11px] uppercase tracking-[0.2em] text-[#a8824a]">
            ← {t('menuBuilder.booking.back')}
          </button>
          <p className="text-sm text-[#6c655b]">
            {t('menuBuilder.booking.reserve.depositNote')}: <strong className="text-[#1f1f1f]">{formatEuro(deposit)}</strong>{' '}
            ({t('menuBuilder.review.estimatedTotal')}: {formatEuro(totalPrice)})
          </p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('menuBuilder.booking.form.name')}
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('menuBuilder.booking.form.email')}
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('menuBuilder.booking.form.phone')}
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          {status === 'unavailable' && (
            <p className="text-xs text-[#8a8275]">{t('menuBuilder.booking.reserve.notConfigured')}</p>
          )}
          {status === 'error' && <p className="text-xs text-[#b4493f]">{t('menuBuilder.booking.scheduler.error')}</p>}
          <button
            onClick={startPayment}
            disabled={!name || !email || status === 'submitting'}
            className="w-full min-h-[52px] bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] text-[#1f1f1f] text-sm uppercase tracking-[0.2em] font-medium rounded-[3px] disabled:opacity-50 transition-opacity"
          >
            {status === 'submitting'
              ? t('menuBuilder.booking.form.submitting')
              : `${t('menuBuilder.booking.reserve.payButton')} ${formatEuro(deposit)}`}
          </button>
        </div>
      )}

      {mode === 'appointment' && (
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setMode('choose')} className="text-[11px] uppercase tracking-[0.2em] text-[#a8824a] mb-4 inline-block">
            ← {t('menuBuilder.booking.back')}
          </button>
          <AppointmentScheduler offerteSummary={offerteSummary} />
        </div>
      )}
    </div>
  );
}
