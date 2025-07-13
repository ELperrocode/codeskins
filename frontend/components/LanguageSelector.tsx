'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const params = useParams();
  const router = useRouter();
  const currentLang = params.lang as string;

  const handleLanguageChange = (langCode: string) => {
    // Get the current path and replace the language part
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(`/${currentLang}`, '');
    const newPath = `/${langCode}${pathWithoutLang}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {supportedLanguages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLang === lang.code ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleLanguageChange(lang.code)}
          className="flex items-center gap-1"
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.name}</span>
        </Button>
      ))}
    </div>
  );
} 