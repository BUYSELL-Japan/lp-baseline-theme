import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export function useLocalize() {
  const { language } = useLanguage();

  function getText(field: any): string {
    if (!field) return '';

    if (typeof field === 'string') {
      return field;
    }

    if (typeof field === 'object' && field !== null && !Array.isArray(field)) {
      if (field[language] !== undefined && field[language] !== null && field[language] !== '') {
        return String(field[language]);
      }
      if (field['ja'] !== undefined && field['ja'] !== null && field['ja'] !== '') {
        return String(field['ja']);
      }
      const firstKey = Object.keys(field)[0];
      if (firstKey && field[firstKey] !== undefined && field[firstKey] !== null && field[firstKey] !== '') {
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

  return { t, getText, language };
}
