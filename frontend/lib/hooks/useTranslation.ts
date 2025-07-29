import { useParams } from 'next/navigation';
import { en } from '../dictionaries/en';
import { es } from '../dictionaries/es';

const dictionaries = {
  en,
  es,
};

export function useTranslation() {
  const params = useParams();
  const lang = (params.lang as string) || 'en';

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = dictionaries.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const changeLanguage = (language: string) => {
    // This would need to be implemented with a state management solution
    // For now, we'll rely on the URL parameter
    console.log('Language changed to:', language);
  };

  return {
    t,
    lang,
    changeLanguage,
    currentLanguage: lang,
  };
} 