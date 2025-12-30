import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export function useLocalize() {
  const { language } = useLanguage();

  function t(obj: any, key: string, fallback: string = ''): string {
    if (!obj) return fallback;
    return getLocalizedValue(obj, key, language) || fallback;
  }

  return { t, language };
}
