import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ja' | 'en' | 'zh-tw' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  basePath: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ja',
  setLanguage: () => {},
  basePath: '/',
});

export function LanguageProvider({ 
  children, 
  initialLanguage = 'ja', 
  basePath = '/' 
}: { 
  children: ReactNode; 
  initialLanguage?: Language;
  basePath?: string;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, basePath }}>
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
