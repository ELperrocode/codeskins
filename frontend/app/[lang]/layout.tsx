import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

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

  // Check if the language is supported
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

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