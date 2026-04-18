import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedValue, translate, getNewsCategory } from '../utils/i18n';

export function useLocalize() {
  const { language } = useLanguage();

  function getText(field: any): string {
    if (!field) return '';

    if (typeof field === 'string') {
      return field;
    }

    if (typeof field === 'object' && field !== null && !Array.isArray(field)) {
      if (field[language] !== undefined && field[language] !== null) {
        return String(field[language]);
      }
      if (field['ja'] !== undefined && field['ja'] !== null) {
        return String(field['ja']);
      }
      const firstKey = Object.keys(field)[0];
      if (firstKey && field[firstKey] !== undefined && field[firstKey] !== null) {
        return String(field[firstKey]);
      }
    }

    return String(field);
  }

  function t(obj: any, key: string, fallback: string = ''): string {
    if (!obj) return fallback;
    const value = getLocalizedValue(obj, key, language);
    return getText(value) || fallback;
  }

  function trans(key: string): string {
    return translate(key, language);
  }

  function getCategory(category: any): string {
    return getNewsCategory(category, language);
  }

  return { t, getText, translate: trans, getCategory, language };
}
