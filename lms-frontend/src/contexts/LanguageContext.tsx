'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  id: number;
  code: string;
  name: string;
  direction: string;
  is_default: boolean;
  status: number;
  flag_icon: string;
  locale_code: string;
}

interface LanguageContextType {
  currentLanguage: Language | null;
  setLanguage: (language: Language) => void;
  languages: Language[];
  setLanguages: (languages: Language[]) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      setCurrentLanguage(JSON.parse(savedLanguage));
    }

    // Fetch available languages
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/languages/active`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('API Response:', result);
        
        // Ensure we're working with an array
        const languageArray = Array.isArray(result) ? result : result.data || [];
        console.log('Language Array:', languageArray);
        
        if (languageArray.length > 0) {
          setLanguages(languageArray);
          
          // If no saved language, use the default one
          if (!savedLanguage) {
            const defaultLang = languageArray.find((lang: Language) => lang.is_default) || languageArray[0];
            setCurrentLanguage(defaultLang);
            localStorage.setItem('preferred_language', JSON.stringify(defaultLang));
            document.documentElement.dir = defaultLang.direction;
            document.documentElement.lang = defaultLang.code;
            document.cookie = `preferred_language=${defaultLang.code};path=/;`;
          }
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
        setLanguages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred_language', JSON.stringify(language));
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
    document.cookie = `preferred_language=${language.code};path=/;`;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages,
        setLanguages,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
