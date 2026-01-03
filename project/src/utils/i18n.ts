import type { Language } from '../contexts/LanguageContext';

export const staticTranslations: Record<string, Record<Language, string>> = {
  all: {
    ja: 'すべて',
    en: 'All',
    'zh-tw': '全部',
    ko: '모두',
  },
  popular: {
    ja: '人気',
    en: 'Popular',
    'zh-tw': '熱門',
    ko: '인기',
  },
  taxIncluded: {
    ja: '税込',
    en: 'Tax Included',
    'zh-tw': '含稅',
    ko: '세금 포함',
  },
  bookingContact: {
    ja: 'ご予約・お問い合わせ',
    en: 'Book / Contact',
    'zh-tw': '預約・諮詢',
    ko: '예약・문의',
  },
  address: {
    ja: '住所',
    en: 'Address',
    'zh-tw': '地址',
    ko: '주소',
  },
  parkingSpaces: {
    ja: '駐車可能台数',
    en: 'Parking Spaces',
    'zh-tw': '停車位',
    ko: '주차 가능 대수',
  },
  storeMap: {
    ja: '店舗地図',
    en: 'Store Map',
    'zh-tw': '店舖地圖',
    ko: '매장 지도',
  },
  showItem: {
    ja: 'を表示',
    en: '',
    'zh-tw': '',
    ko: '',
  },
  menu: {
    ja: 'メニュー',
    en: 'Menu',
    'zh-tw': '菜單',
    ko: '메뉴',
  },
  image: {
    ja: '画像',
    en: 'Image',
    'zh-tw': '圖片',
    ko: '이미지',
  },
  review: {
    ja: 'レビュー',
    en: 'Review',
    'zh-tw': '評論',
    ko: '리뷰',
  },
};

export function translate(key: string, language: Language): string {
  return staticTranslations[key]?.[language] || staticTranslations[key]?.['ja'] || '';
}

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
