import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export function useLocalize() {
  const { language } = useLanguage();

  function getText(field: any): string {
    console.log('[getText] Input:', field, 'Language:', language);

    if (!field) {
      console.log('[getText] Field is empty, returning empty string');
      return '';
    }

    if (typeof field === 'string') {
      console.log('[getText] Field is string, returning:', field);
      return field;
    }

    if (typeof field === 'object' && field !== null && !Array.isArray(field)) {
      console.log('[getText] Field is object, keys:', Object.keys(field));

      if (field[language] !== undefined && field[language] !== null) {
        console.log('[getText] Using language key:', language, 'value:', field[language]);
        return String(field[language]);
      }
      if (field['ja'] !== undefined && field['ja'] !== null) {
        console.log('[getText] Using ja fallback, value:', field['ja']);
        return String(field['ja']);
      }
      const firstKey = Object.keys(field)[0];
      if (firstKey && field[firstKey] !== undefined && field[firstKey] !== null) {
        console.log('[getText] Using first key:', firstKey, 'value:', field[firstKey]);
        return String(field[firstKey]);
      }
    }

    console.log('[getText] Returning as string:', String(field));
    return String(field);
  }

  function t(obj: any, key: string, fallback: string = ''): string {
    console.log('[t] obj:', obj, 'key:', key, 'fallback:', fallback);

    if (!obj) {
      console.log('[t] No obj, returning fallback');
      return fallback;
    }

    const value = getLocalizedValue(obj, key, language);
    console.log('[t] getLocalizedValue returned:', value);

    const result = getText(value) || fallback;
    console.log('[t] Final result:', result);

    return result;
  }

  return { t, getText, language };
}
