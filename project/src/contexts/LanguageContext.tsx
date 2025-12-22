import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ja' | 'en' | 'zh-tw' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ja',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const languageNames: Record<Language, string> = {
  ja: '日本語',
  en: 'English',
  'zh-tw': '繁體中文',
  ko: '한국어',
};
