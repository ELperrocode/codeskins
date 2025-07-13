'use client';

import { useParams } from 'next/navigation';
import { en } from '../dictionaries/en';
import { es } from '../dictionaries/es';

const dictionaries = {
  en,
  es,
};

export function useDictionary() {
  const params = useParams();
  const lang = params.lang as string || 'en';
  
  // Fallback to English if language is not supported
  const dictionary = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
  
  return {
    t: dictionary,
    lang,
  };
} 