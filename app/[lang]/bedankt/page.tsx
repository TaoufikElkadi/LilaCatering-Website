'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Lang = 'nl' | 'en' | 'fr';
type Phase = 'loading' | 'paid' | 'pending' | 'failed' | 'unknown';

const COPY: Record<Lang, Record<Exclude<Phase, 'loading'>, { title: string; body: string }> & {
  kicker: string;
  loading: string;
  home: string;
  contactLabel: string;
}> = {
  nl: {
    kicker: 'Authentieke Marokkaanse keuken',
    loading: 'Even geduld, we controleren je betaling…',
    home: 'Terug naar de website',
    contactLabel: 'Vragen? Neem gerust contact op',
    paid: {
      title: 'Bedankt voor je reservering',
      body: 'Je aanbetaling is ontvangen en je datum is vastgelegd. Je krijgt zo een bevestiging per e-mail. Kort daarna ontvang je het contract via Signhost om digitaal te ondertekenen.',
    },
    pending: {
      title: 'We verwerken je betaling',
      body: 'Je betaling wordt nog verwerkt. Zodra deze binnen is, ontvang je automatisch een bevestiging en het contract per e-mail. Je hoeft niets te doen.',
    },
    failed: {
      title: 'Betaling niet voltooid',
      body: 'Je betaling is niet afgerond, dus je datum is nog niet gereserveerd. Je kunt het opnieuw proberen via de menubouwer of contact met ons opnemen.',
    },
    unknown: {
      title: 'Bedankt',
      body: 'We konden de status van je betaling niet direct ophalen. Heb je zojuist betaald, dan ontvang je een bevestiging per e-mail. Neem anders gerust contact met ons op.',
    },
  },
  en: {
    kicker: 'Authentic Moroccan cuisine',
    loading: 'One moment, we are checking your payment…',
    home: 'Back to the website',
    contactLabel: 'Questions? Get in touch',
    paid: {
      title: 'Thank you for your reservation',
      body: 'Your deposit has been received and your date is secured. You will get a confirmation by email shortly, followed by the contract via Signhost to sign digitally.',
    },
    pending: {
      title: 'We are processing your payment',
      body: 'Your payment is still being processed. Once it comes through, you will automatically receive a confirmation and the contract by email. Nothing further is needed.',
    },
    failed: {
      title: 'Payment not completed',
      body: 'Your payment was not completed, so your date is not reserved yet. You can try again from the menu builder or contact us.',
    },
    unknown: {
      title: 'Thank you',
      body: 'We could not retrieve your payment status right away. If you just paid, you will receive a confirmation by email. Otherwise, please contact us.',
    },
  },
  fr: {
    kicker: 'Cuisine marocaine authentique',
    loading: 'Un instant, nous vérifions votre paiement…',
    home: 'Retour au site',
    contactLabel: 'Des questions ? Contactez-nous',
    paid: {
      title: 'Merci pour votre réservation',
      body: 'Votre acompte a bien été reçu et votre date est réservée. Vous recevrez une confirmation par e-mail sous peu, suivie du contrat via Signhost à signer numériquement.',
    },
    pending: {
      title: 'Nous traitons votre paiement',
      body: 'Votre paiement est en cours de traitement. Dès qu’il sera confirmé, vous recevrez automatiquement une confirmation et le contrat par e-mail. Rien d’autre à faire.',
    },
    failed: {
      title: 'Paiement non finalisé',
      body: 'Votre paiement n’a pas abouti, votre date n’est donc pas encore réservée. Vous pouvez réessayer depuis le configurateur ou nous contacter.',
    },
    unknown: {
      title: 'Merci',
      body: 'Nous n’avons pas pu récupérer le statut de votre paiement. Si vous venez de payer, vous recevrez une confirmation par e-mail. Sinon, contactez-nous.',
    },
  },
};

export default function BedanktPage() {
  const params = useParams();
  const raw = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const lang: Lang = raw === 'en' ? 'en' : raw === 'fr' ? 'fr' : 'nl';
  const t = COPY[lang];

  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    let active = true;
    const map = (s: string): Phase =>
      s === 'paid' || s === 'authorized'
        ? 'paid'
        : s === 'open' || s === 'pending'
          ? 'pending'
          : s === 'failed' || s === 'canceled' || s === 'expired'
            ? 'failed'
            : 'unknown';
    fetch('/api/payments/status')
      .then((r) => r.json())
      .then((d) => active && setPhase(map(String(d?.status ?? 'unknown'))))
      .catch(() => active && setPhase('unknown'));
    return () => {
      active = false;
    };
  }, []);

  const isFailed = phase === 'failed';
  const accent = isFailed ? '#c98a5b' : '#C19A5B';
  const content = phase === 'loading' ? null : t[phase];

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#14110d] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 moroccan-pattern opacity-[0.04]" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: `${accent}1a` }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-xl">
        <Image
          src="/logo-mark.png"
          alt="Lila Catering"
          width={120}
          height={120}
          priority
          className="mb-8 h-20 w-auto sm:h-24"
        />

        <p className="text-[11px] tracking-[0.4em] uppercase mb-5" style={{ color: accent }}>
          {t.kicker}
        </p>

        {phase === 'loading' ? (
          <p className="text-sm text-[#c9bfa9] animate-pulse py-8">{t.loading}</p>
        ) : (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.05em] text-[#f4ecdd] mb-6">
              {content!.title}
            </h1>
            <span className="block h-px w-16 mb-6" style={{ background: `${accent}99` }} />
            <p className="text-sm sm:text-base leading-relaxed text-[#c9bfa9] mb-10 max-w-lg">
              {content!.body}
            </p>

            <Link
              href={`/${lang}`}
              className="text-sm tracking-[0.08em] text-[#f4ecdd] border-b pb-0.5 transition-colors hover:opacity-80"
              style={{ borderColor: `${accent}66` }}
            >
              {t.home}
            </Link>

            <p className="mt-10 text-[11px] tracking-[0.28em] text-[#8f866f] uppercase mb-3">
              {t.contactLabel}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="mailto:info@lilacatering.nl"
                className="text-sm tracking-[0.08em] text-[#f4ecdd] border-b border-[#C19A5B]/40 pb-0.5 transition-colors hover:text-[#C19A5B]"
              >
                info@lilacatering.nl
              </a>
              <a
                href="https://wa.me/31203635478?text=Hallo%20Lila%20Catering%2C%20ik%20heb%20een%20vraag%20over..."
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-[0.08em] text-[#f4ecdd] border-b border-[#C19A5B]/40 pb-0.5 transition-colors hover:text-[#C19A5B]"
              >
                WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
