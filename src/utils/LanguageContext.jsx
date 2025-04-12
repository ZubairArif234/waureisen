import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from './translations';

// Create the language context
const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translate function
  const t = (key) => {
    if (!translations[language]) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }

    const translation = translations[language][key];
    if (!translation) {
      console.warn(`No translation found for key: ${key} in language: ${language}`);
      return key;
    }

    return translation;
  };

  // Switch language function
  const switchLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'de') {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }
    setLanguage(lang);
  };

  // Provide the language context to all children
  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};