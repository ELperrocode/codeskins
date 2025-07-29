import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  const params = useParams();
  const lang = params.lang as string;

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const currentLanguage = i18n.language;

  return {
    t,
    i18n,
    lang,
    changeLanguage,
    currentLanguage,
  };
} 