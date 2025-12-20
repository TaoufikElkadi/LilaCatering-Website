'use client';

import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

const companies = [
  { id: 1, name: 'Company 1', logo: '/logos/logo1.svg' },
  { id: 2, name: 'Company 2', logo: '/logos/logo2.svg' },
  { id: 3, name: 'Company 3', logo: '/logos/logo3.svg' },
  { id: 4, name: 'Company 4', logo: '/logos/logo4.svg' },
  { id: 5, name: 'Company 5', logo: '/logos/logo5.jpg' },
  { id: 6, name: 'Company 6', logo: '/logos/logo6.png' },
];

const duplicatedCompanies = [...companies, ...companies, ...companies];

export default function CompanyLogos() {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 md:py-28 bg-[#f7f3ec]">
      <div className="max-w-[90rem] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C19A5B]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#C19A5B] font-light">
              {t('companyLogos.kicker')}
            </span>
            <div className="h-px w-12 bg-[#C19A5B]" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#1f1f1f] mb-4">
            {t('companyLogos.title')}
          </h2>

          <p className="text-base md:text-lg text-[#6c655b] max-w-2xl mx-auto font-light">
            {t('companyLogos.description')}
          </p>
        </div>

        {/* Logos Container */}
        <div className="relative overflow-hidden py-8">
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f7f3ec] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f7f3ec] to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling content */}
          <div className="flex animate-scroll-logos">
            {duplicatedCompanies.map((company, index) => (
              <div key={`${company.id}-${index}`} className="flex-shrink-0 mx-6 group">
                <div className="relative w-64 h-40 flex items-center justify-center bg-white/40 backdrop-blur-md border border-[#e5ddd0]/50 transition-all duration-500 hover:bg-white/70 hover:border-[#c7b9a5] hover:shadow-[0_8px_30px_rgba(193,154,91,0.15)] hover:scale-105 hover:-translate-y-1 overflow-hidden">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C19A5B]/5 via-transparent to-[#C19A5B]/5" />
                  </div>
                  
                  {/* Logo */}
                  <div className="relative z-10 w-full h-full p-6">
                    <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-contain group-hover:saturate-[0.85] transition-all duration-500"
                        sizes="256px"
                      />
                    </div>
                  </div>
                  
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C19A5B]/0 group-hover:border-[#C19A5B]/30 transition-all duration-300" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C19A5B]/0 group-hover:border-[#C19A5B]/30 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C19A5B]/0 group-hover:border-[#C19A5B]/30 transition-all duration-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C19A5B]/0 group-hover:border-[#C19A5B]/30 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
