'use client';

import { useState } from 'react';
import { CalendarCheck, CreditCard, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { formatEuro } from '@/lib/pricing';
import { getDepositAmount } from '@/lib/booking';
import { applyDiscount, type AppliedDiscount } from '@/lib/discount';
import AppointmentScheduler from './AppointmentScheduler';

type DecorTier = 'basic' | 'premium' | 'luxury';

interface Props {
  totalPrice: number;
  eventDate: string;
  eventType: string;
  guestCount: number;
  eventStart?: string;
  eventEnd?: string;
  foodTime?: string;
  offerteSummary: string;
  /** Structured booking used to generate the Signhost contract. */
  contractData?: {
    menu: { hapjes: string[]; voorgerecht: string[]; hoofdgerecht: string[]; nagerecht: string[] };
    decoration: Partial<Record<'tafeldecoratie' | 'servies' | 'sfeeraankleding', DecorTier>>;
    venue?: string;
  };
  /** Set when the customer just returned from a successful/attempted payment. */
  paid?: { status?: string; deposit?: number } | null;
}

const localeTag = (lang: string) => (lang === 'nl' ? 'nl-NL' : lang === 'fr' ? 'fr-FR' : 'en-US');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingActions({
  totalPrice,
  eventDate,
  eventType,
  guestCount,
  eventStart,
  eventEnd,
  foodTime,
  offerteSummary,
  contractData,
  paid,
}: Props) {
  const { t, lang } = useLanguage();
  const [mode, setMode] = useState<'choose' | 'reserve' | 'appointment'>('choose');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'unavailable'>('idle');

  // Discount code (validated again server-side before charging).
  const [discountCode, setDiscountCode] = useState('');
  const [applied, setApplied] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState(false);

  const effectiveTotal = applied ? applied.discountedTotal : totalPrice;
  const deposit = getDepositAmount(effectiveTotal);

  const applyCode = () => {
    const result = applyDiscount(totalPrice, discountCode);
    if (result) {
      setApplied(result);
      setDiscountError(false);
    } else {
      setApplied(null);
      setDiscountError(true);
    }
  };

  // Contact + address details are required; the email must be well-formed.
  const emailValid = EMAIL_RE.test(email.trim());
  const canSubmit =
    firstName.trim() !== '' &&
    phone.trim() !== '' &&
    emailValid &&
    address.trim() !== '' &&
    postcode.trim() !== '' &&
    city.trim() !== '' &&
    termsAccepted;

  const startPayment = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPrice,
          eventDate,
          eventType,
          guestCount,
          eventStart,
          eventEnd,
          foodTime,
          discountCode: applied?.code,
          customer: {
            name: fullName,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            postcode: postcode.trim(),
            city: city.trim(),
          },
          contract: contractData,
          termsAccepted,
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
        // Keep the payment id in sessionStorage (survives the Mollie round-trip
        // even if cookies are dropped) so the return can show the real status.
        try {
          if (data.paymentId) sessionStorage.setItem('lila-payment-id', data.paymentId);
        } catch {
          /* storage unavailable — status falls back to the cookie */
        }
        window.location.href = data.checkoutUrl;
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  // Payment-return phase (Mollie redirects back for every outcome, so map it).
  const paidPhase: 'paid' | 'pending' | 'failed' | null = !paid
    ? null
    : !paid.status
      ? 'pending'
      : paid.status === 'paid' || paid.status === 'authorized'
        ? 'paid'
        : paid.status === 'open' || paid.status === 'pending'
          ? 'pending'
          : 'failed';

  const lockedDate = eventDate
    ? new Date(`${eventDate}T00:00:00`).toLocaleDateString(localeTag(lang), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const paidDeposit = paid?.deposit && paid.deposit > 0 ? paid.deposit : deposit;

  // Confirmed / processing: show a locked-in banner + the appointment scheduler.
  if (paidPhase === 'paid' || paidPhase === 'pending') {
    const ok = paidPhase === 'paid';
    return (
      <div className="mt-8 sm:mt-12 border-t border-[#dcd3c5] pt-8 sm:pt-12">
        <div className="max-w-2xl mx-auto text-center">
          <span
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
              ok ? 'bg-[#3f7d52]/12 text-[#3f7d52]' : 'bg-[#C19A5B]/12 text-[#a8824a]'
            }`}
          >
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#1f1f1f] mb-3">
            {ok ? t('menuBuilder.booking.paid.successTitle') : t('menuBuilder.booking.paid.pendingTitle')}
          </h3>
          {ok && lockedDate && (
            <div className="mx-auto mb-4 inline-flex flex-col items-center gap-1 rounded-[3px] border border-[#dfd2ba] bg-[#f6f1e8] px-6 py-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8275]">
                {t('menuBuilder.booking.paid.dateLocked')}
              </span>
              <span className="text-sm font-medium text-[#1f1f1f]">{lockedDate}</span>
              <span className="text-xs text-[#6c655b]">
                {t('menuBuilder.booking.paid.depositReceived')} {formatEuro(paidDeposit)}
              </span>
            </div>
          )}
          <p className="text-sm text-[#6c655b] leading-relaxed max-w-lg mx-auto">
            {ok ? t('menuBuilder.booking.paid.body') : t('menuBuilder.booking.paid.pendingBody')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-10 border-t border-[#e6ddd0] pt-8">
          <div className="text-center mb-6">
            <h4 className="text-lg sm:text-xl font-serif text-[#1f1f1f] mb-1.5">
              {t('menuBuilder.booking.paid.scheduleTitle')}
            </h4>
            <p className="text-xs sm:text-sm text-[#6c655b] max-w-md mx-auto">
              {t('menuBuilder.booking.paid.scheduleSubtitle')}
            </p>
          </div>
          <AppointmentScheduler offerteSummary={offerteSummary} />
        </div>
      </div>
    );
  }

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

      {paidPhase === 'failed' && (
        <div className="max-w-md mx-auto mb-6 rounded-[3px] border border-[#e0b4ac] bg-[#f7e9e6] px-4 py-3 text-center">
          <p className="text-sm font-medium text-[#b4493f]">{t('menuBuilder.booking.paid.failedTitle')}</p>
          <p className="text-xs text-[#8a6a64] mt-1">{t('menuBuilder.booking.paid.failedBody')}</p>
        </div>
      )}

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
            ({t('menuBuilder.review.estimatedTotal')}:{' '}
            {applied ? (
              <>
                <span className="line-through text-[#a39e94]">{formatEuro(totalPrice)}</span>{' '}
                <span className="text-[#1f1f1f]">{formatEuro(effectiveTotal)}</span>
              </>
            ) : (
              formatEuro(totalPrice)
            )}
            )
          </p>
          <p className="text-[11px] text-[#8a8275]">{t('menuBuilder.booking.form.requiredNote')}</p>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={`${t('menuBuilder.booking.form.firstName')} *`} autoComplete="given-name"
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('menuBuilder.booking.form.lastName')} autoComplete="family-name"
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`${t('menuBuilder.booking.form.email')} *`} autoComplete="email"
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          {email.trim() !== '' && !emailValid && (
            <p className="text-xs text-[#b4493f]">{t('menuBuilder.booking.form.emailInvalid')}</p>
          )}
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`${t('menuBuilder.booking.form.phone')} *`} autoComplete="tel"
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={`${t('menuBuilder.booking.form.address')} *`} autoComplete="street-address"
            className="w-full border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          <div className="flex gap-2">
            <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder={`${t('menuBuilder.booking.form.postcode')} *`} autoComplete="postal-code"
              className="w-1/3 border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={`${t('menuBuilder.booking.form.city')} *`} autoComplete="address-level2"
              className="flex-1 border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm outline-none focus:border-[#C19A5B] rounded-[2px]" />
          </div>

          {/* Discount code */}
          <div className="flex gap-2">
            <input
              value={discountCode}
              onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(false); }}
              placeholder={t('menuBuilder.booking.form.discountPlaceholder')}
              className="flex-1 border-[1.5px] border-[#e0d3b8] bg-white/60 px-4 py-3 text-sm uppercase tracking-wider outline-none focus:border-[#C19A5B] rounded-[2px]"
            />
            <button
              type="button"
              onClick={applyCode}
              disabled={discountCode.trim() === ''}
              className="shrink-0 border-[1.5px] border-[#C19A5B] px-4 text-xs uppercase tracking-[0.18em] text-[#a8824a] rounded-[2px] disabled:opacity-40 hover:bg-[#C19A5B]/10 transition-colors"
            >
              {t('menuBuilder.booking.form.discountApply')}
            </button>
          </div>
          {applied && (
            <p className="text-xs text-[#3f7d52]">
              {t('menuBuilder.booking.form.discountApplied')} {applied.code} · −{formatEuro(applied.discountAmount)}
            </p>
          )}
          {discountError && (
            <p className="text-xs text-[#b4493f]">{t('menuBuilder.booking.form.discountInvalid')}</p>
          )}

          {/* Algemene voorwaarden — required before paying */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
            <span
              onClick={() => setTermsAccepted((v) => !v)}
              className={`mt-0.5 flex items-center justify-center w-5 h-5 shrink-0 rounded-[3px] border transition-colors duration-200 ${
                termsAccepted ? 'bg-[#C19A5B] border-[#C19A5B] text-white' : 'border-[#dcc8a4] bg-white text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="sr-only" />
            <span className="text-[12px] text-[#6c655b] leading-snug">{t('menuBuilder.booking.form.terms')}</span>
          </label>

          {status === 'unavailable' && (
            <p className="text-xs text-[#8a8275]">{t('menuBuilder.booking.reserve.notConfigured')}</p>
          )}
          {status === 'error' && <p className="text-xs text-[#b4493f]">{t('menuBuilder.booking.scheduler.error')}</p>}
          <button
            onClick={startPayment}
            disabled={!canSubmit || status === 'submitting'}
            className="w-full min-h-[52px] bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] text-[#1f1f1f] text-sm uppercase tracking-[0.2em] font-medium rounded-[3px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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
