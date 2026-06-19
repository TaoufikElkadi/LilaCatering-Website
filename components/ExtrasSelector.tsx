'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Cookie, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { COFFEE_LUXE_PER_GUEST, COOKIES_LUXE_PER_GUEST, formatEuro } from '@/lib/pricing';
import { StepHeader, StarSeal, InsetFrame } from './MenuDecor';

interface ServiceSelectorProps {
  coffeeLuxe: boolean;
  cookiesLuxe: boolean;
  onCoffeeLuxeToggle: (value: boolean) => void;
  onCookiesLuxeToggle: (value: boolean) => void;
}

function ServiceSelector({
  coffeeLuxe,
  cookiesLuxe,
  onCoffeeLuxeToggle,
  onCookiesLuxeToggle,
}: ServiceSelectorProps) {
  const { t } = useLanguage();

  const includedKeys = ['included1', 'included2', 'included3', 'included4', 'included5'];

  const upgrades = [
    {
      key: 'coffee',
      icon: Coffee,
      name: t('menuBuilder.extras.coffeeName'),
      luxe: coffeeLuxe,
      toggle: onCoffeeLuxeToggle,
      standardDesc: t('menuBuilder.extras.coffeeStandardDesc'),
      luxeDesc: t('menuBuilder.extras.coffeeLuxeDesc'),
      price: COFFEE_LUXE_PER_GUEST,
    },
    {
      key: 'cookies',
      icon: Cookie,
      name: t('menuBuilder.extras.cookiesName'),
      luxe: cookiesLuxe,
      toggle: onCookiesLuxeToggle,
      standardDesc: t('menuBuilder.extras.cookiesStandardDesc'),
      luxeDesc: t('menuBuilder.extras.cookiesLuxeDesc'),
      price: COOKIES_LUXE_PER_GUEST,
    },
  ];

  return (
    <div className="space-y-12">
      <StepHeader title={t('menuBuilder.extras.title')} subtitle={t('menuBuilder.extras.subtitle')} />

      {/* Standard included on every table */}
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-[3px] border border-[#dfd2ba] bg-gradient-to-br from-[#fdfbf7] to-[#f5efe3] p-6 sm:p-8 shadow-[0_18px_46px_-26px_rgba(80,60,30,0.4)]">
          <StarSeal className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 text-[#C19A5B]/[0.06]" />
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] uppercase tracking-[0.32em] text-[#1f1f1f] font-medium">
              {t('menuBuilder.extras.includedTitle')}
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#a8824a] border border-[#C19A5B]/40 px-2 py-0.5">
              {t('menuBuilder.extras.includedTag')}
            </span>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {includedKeys.map((k) => (
              <li key={k} className="flex items-start gap-2.5 text-sm text-[#3a352c] font-light">
                <Check className="mt-0.5 w-3.5 h-3.5 shrink-0 text-[#C19A5B]" strokeWidth={2.5} />
                <span>{t(`menuBuilder.extras.${k}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Optional luxe upgrades */}
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] tracking-[0.28em] text-[#a8824a] mb-6 text-center uppercase">
          {t('menuBuilder.extras.upgradeLabel')}
        </p>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {upgrades.map(({ key, icon: Icon, name, luxe, toggle, standardDesc, luxeDesc, price }) => (
            <div
              key={key}
              className="relative overflow-hidden rounded-[3px] border border-[#e7ddcb] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] p-6 sm:p-7 shadow-[0_12px_34px_-22px_rgba(80,60,30,0.35)]"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e0d5c2] text-[#b39256]">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <h4 className="text-lg font-serif font-light tracking-[0.05em] text-[#1f1f1f]">{name}</h4>
              </div>

              <div className="space-y-3">
                {/* Standard option */}
                <button
                  onClick={() => toggle(false)}
                  className={`group relative w-full text-left rounded-[2px] border px-4 py-3.5 transition-all duration-300 ${
                    !luxe
                      ? 'border-[#C19A5B] bg-[#C19A5B]/[0.07]'
                      : 'border-[#e3d7c1] bg-white/40 hover:border-[#d6c39d]'
                  }`}
                >
                  <InsetFrame isActive={!luxe} />
                  <div className="relative flex items-center justify-between gap-3">
                    <div>
                      <p className={`text-sm tracking-[0.04em] ${!luxe ? 'text-[#1f1f1f] font-medium' : 'text-[#3a352c]'}`}>
                        {t('menuBuilder.extras.standardName')}
                      </p>
                      <p className="text-[11px] text-[#6c655b] mt-0.5 font-light">{standardDesc}</p>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[#a8824a]">
                      {t('menuBuilder.extras.includedTag')}
                    </span>
                  </div>
                </button>

                {/* Luxe option */}
                <button
                  onClick={() => toggle(true)}
                  className={`group relative w-full text-left rounded-[2px] border px-4 py-3.5 transition-all duration-300 ${
                    luxe
                      ? 'border-[#C19A5B] bg-[#C19A5B]/[0.07]'
                      : 'border-[#e3d7c1] bg-white/40 hover:border-[#d6c39d]'
                  }`}
                >
                  <InsetFrame isActive={luxe} />
                  <div className="relative flex items-center justify-between gap-3">
                    <div>
                      <p className={`text-sm tracking-[0.04em] ${luxe ? 'text-[#1f1f1f] font-medium' : 'text-[#3a352c]'}`}>
                        {t('menuBuilder.extras.luxeName')}
                      </p>
                      <p className="text-[11px] text-[#6c655b] mt-0.5 font-light">{luxeDesc}</p>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[#a8824a]">
                      +{formatEuro(price)} {t('menuBuilder.extras.perGuest')}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ServiceSelector);
