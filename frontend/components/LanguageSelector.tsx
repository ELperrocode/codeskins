'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useTranslation } from '../lib/hooks/useTranslation';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const params = useParams();
  const router = useRouter();
  const currentLang = params.lang as string;

  const handleLanguageChange = (langCode: string) => {
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(`/${currentLang}`, '');
    const newPath = `/${langCode}${pathWithoutLang}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1">
      {supportedLanguages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLang === lang.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleLanguageChange(lang.code)}
          className={`h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110 ${
            currentLang === lang.code 
              ? 'bg-yellow-400 text-black shadow-md' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title={lang.name}
        >
          <span className="text-sm">{lang.flag}</span>
        </Button>
      ))}
    </div>
  );
} 