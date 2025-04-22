// src/utils/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from './translations';

// Create the language context
const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  // Persist language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translate function with simple {param} interpolation
  const t = (key, params = {}) => {
    const dict = translations[language];
    if (!dict) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }

    let str = dict[key];
    if (typeof str !== 'string') {
      console.warn(`No translation found for key: ${key} in language: ${language}`);
      return key;
    }

    // Replace all occurrences of {foo} with params.foo
    return str.replace(/\{(\w+)\}/g, (_, name) =>
      params[name] != null ? params[name] : `{${name}}`
    );
  };

  // Language switcher
  const switchLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'de') {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for consuming the context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
