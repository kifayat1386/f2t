"use client";

import React, { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'bn';

interface I18nContextProps {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.farmer': 'Farmer Portal',
    'nav.admin': 'Admin',
    'nav.ledger': 'Public Ledger',
    'nav.portfolio': 'Portfolio',
    'home.title': 'KhamarBari Premium Pantry',
    'home.subtitle': 'Verified farms, delivered to your door with cryptographic trust.',
    'btn.toggle': 'বাংলা',
  },
  bn: {
    'nav.home': 'হোম',
    'nav.farmer': 'কৃষক পোর্টাল',
    'nav.admin': 'অ্যাডমিন',
    'nav.ledger': 'পাবলিক লেজার',
    'nav.portfolio': 'পোর্টফোলিও',
    'home.title': 'খামারবাড়ি প্রিমিয়াম প্যান্ট্রি',
    'home.subtitle': 'যাচাইকৃত খামার থেকে সরাসরি আপনার দরজায়, ক্রিপ্টোগ্রাফিক বিশ্বাসের সাথে।',
    'btn.toggle': 'English',
  }
};

const I18nContext = createContext<I18nContextProps>({
  locale: 'en',
  toggleLocale: () => {},
  t: () => '',
});

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const toggleLocale = () => setLocale(prev => prev === 'en' ? 'bn' : 'en');

  const t = (key: string) => {
    return translations[locale][key as keyof typeof translations['en']] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
