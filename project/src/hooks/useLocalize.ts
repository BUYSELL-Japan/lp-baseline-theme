import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export function useLocalize() {
  const { language } = useLanguage();

  function t(obj: any, key: string, fallback: string = ''): string {
    if (!obj) return fallback;
    const value = getLocalizedValue(obj, key, language);

    if (typeof value === 'string') {
      return value;
    }

    if (value && typeof value === 'object') {
      if (value[language]) return String(value[language]);
      if (value['ja']) return String(value['ja']);
      const firstKey = Object.keys(value)[0];
      if (firstKey) return String(value[firstKey]);
    }

    return fallback;
  }

  return { t, language };
}
