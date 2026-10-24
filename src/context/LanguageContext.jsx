import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
  lang: 'ar',
  setLang: () => {},
  toggleLang: () => {},
  isAr: true,
  isEn: false,
  dir: 'rtl',
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('natheel_lang');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {
      // Fallback
    }
    return 'ar';
  });

  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const dir = isAr ? 'rtl' : 'ltr';

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('natheel_lang', lang);
    } catch {
      // Ignore storage errors
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('data-lang', lang);

    if (isEn) {
      document.title = 'Natheel — Building Structured Ventures';
    } else {
      document.title = 'نثيل — تطوير مشاريع واعدة | Natheel';
    }
  }, [lang, dir, isEn]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isAr, isEn, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
