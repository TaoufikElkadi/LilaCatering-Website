'use client';

import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { getTranslation } from '../utils/translations';

type Lang = 'en' | 'fr' | 'nl';

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

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
