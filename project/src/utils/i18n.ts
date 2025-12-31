import type { Language } from '../contexts/LanguageContext';

export function getLocalizedValue<T extends Record<string, any>>(
  obj: T,
  key: string,
  language: Language
): any {
  if (!obj) return '';

  const value = obj[key];

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (value[language] !== undefined) {
      return value[language];
    }
    if (value['ja'] !== undefined) {
      return value['ja'];
    }
    return value[Object.keys(value)[0]] || '';
  }

  const localizedKey = `${key}_${language}`;
  if (obj[localizedKey] !== undefined) {
    return obj[localizedKey];
  }

  const fallbackKey = `${key}_ja`;
  if (obj[fallbackKey] !== undefined) {
    return obj[fallbackKey];
  }

  return value || '';
}

export function localizeObject<T extends Record<string, any>>(
  obj: T,
  language: Language,
  keysToLocalize: string[]
): any {
  if (!obj) return obj;

  const result: any = { ...obj };

  for (const key of keysToLocalize) {
    if (key in obj) {
      const value = obj[key];

      if (typeof value === 'string' && key.includes('_')) {
        continue;
      }

      result[key] = getLocalizedValue(obj, key, language);
    }
  }

  return result;
}

export function localizeArray<T extends Record<string, any>>(
  array: T[],
  language: Language,
  keysToLocalize: string[]
): T[] {
  if (!array) return array;

  return array.map(item => localizeObject(item, language, keysToLocalize));
}
