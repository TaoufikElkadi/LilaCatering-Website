import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Lila Catering — Binnenkort online',
  description: 'Onze nieuwe website is in de maak. Voor reserveringen en vragen kunt u contact met ons opnemen.',
  robots: { index: false, follow: false },
};

export default function ComingSoon() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#14110d] px-6 text-center">
      {/* subtle moroccan texture + gold glow */}
      <div className="pointer-events-none absolute inset-0 moroccan-pattern opacity-[0.04]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C19A5B]/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center max-w-xl">
        {/* Logo mark */}
        <Image
          src="/logo-mark.png"
          alt="Lila Catering"
          width={120}
          height={120}
          priority
          className="mb-8 h-24 w-auto sm:h-28"
        />

        <p className="text-[11px] tracking-[0.4em] text-[#C19A5B] uppercase mb-5">
          Authentieke Marokkaanse keuken
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-[0.06em] text-[#f4ecdd] mb-6">
          Binnenkort online
        </h1>

        {/* gold divider */}
        <span className="block h-px w-16 bg-[#C19A5B]/60 mb-6" />

        <p className="text-sm sm:text-base leading-relaxed text-[#c9bfa9] mb-2">
          Onze nieuwe website is in de maak.
        </p>
        <p className="text-xs sm:text-sm leading-relaxed text-[#8f866f] mb-10">
          Our new website is on its way · Notre nouveau site arrive bientôt
        </p>

        {/* Contact */}
        <p className="text-[11px] tracking-[0.28em] text-[#8f866f] uppercase mb-4">
          Voor reserveringen &amp; vragen
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <a
            href="mailto:info@lilacatering.nl"
            className="text-sm tracking-[0.08em] text-[#f4ecdd] border-b border-[#C19A5B]/40 pb-0.5 transition-colors hover:text-[#C19A5B]"
          >
            info@lilacatering.nl
          </a>
          <a
            href="https://www.instagram.com/lilacatering/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-[0.08em] text-[#f4ecdd] border-b border-[#C19A5B]/40 pb-0.5 transition-colors hover:text-[#C19A5B]"
          >
            Instagram
          </a>
        </div>
      </div>
    </main>
  );
}
