'use client';

import { ReactNode, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useTranslation } from '../../lib/hooks/useTranslation';

// Supported languages
const supportedLanguages = ['en', 'es'];

interface LangLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = params;
  const { changeLanguage } = useTranslation();

  // Check if the language is supported
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  // Set the language when the component mounts
  useEffect(() => {
    changeLanguage(lang);
  }, [lang, changeLanguage]);

  return (
    <div data-lang={lang}>
      {children}
    </div>
  );
}

// Generate static params for all supported languages
export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({
    lang,
  }));
} 