import React, { createContext, useContext, useState, useEffect } from 'react';
import type { LanguageCode } from '../types';
import { translations, getNestedTranslation } from '../i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('ner_cognitive_lang');
    return (saved as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('ner_cognitive_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string): string => {
    const activeDict = translations[language] || translations.en;
    const value = getNestedTranslation(activeDict as unknown as Record<string, unknown>, path);
    if (value === path && language !== 'en') {
      // Fallback to English if key missing in regional language
      return getNestedTranslation(translations.en as unknown as Record<string, unknown>, path);
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
