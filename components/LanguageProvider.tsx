'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { getTranslation } from '../utils/translations';

type Lang = 'en' | 'fr' | 'nl';

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang ?? 'nl');

  // Persist language so server can align SEO + <html lang> on subsequent requests
  useEffect(() => {
    try {
      document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      localStorage.setItem('lang', lang);
    } catch {
      // no-op
    }
  }, [lang]);

  // If server-provided initialLang changes (e.g. via locale route), sync state once.
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (path: string) => getTranslation(lang, path),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
