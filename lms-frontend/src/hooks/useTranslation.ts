'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

interface Translations {
  [key: string]: string;
}

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      if (!currentLanguage) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/translations/system-messages?language=${currentLanguage.code}`
        );
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error fetching translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [currentLanguage]);

  const t = (key: string, params: { [key: string]: string | number } = {}) => {
    let translation = translations[key] || key;

    // Replace parameters in translation string
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`{${paramKey}}`, String(paramValue));
    });

    return translation;
  };

  return {
    t,
    isLoading,
    currentLanguage,
    translations,
  };
}

// Helper function to format dates according to the current language
export function useFormatDate() {
  const { currentLanguage } = useLanguage();

  return (date: Date | string, options: Intl.DateTimeFormatOptions = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      currentLanguage?.locale_code || 'en-US',
      options
    ).format(dateObj);
  };
}

// Helper function to format numbers according to the current language
export function useFormatNumber() {
  const { currentLanguage } = useLanguage();

  return (number: number, options: Intl.NumberFormatOptions = {}) => {
    return new Intl.NumberFormat(
      currentLanguage?.locale_code || 'en-US',
      options
    ).format(number);
  };
}
