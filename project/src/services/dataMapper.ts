import type {
  HeaderData,
  HeroData,
  AboutData,
  MenuData,
  StoreInfoData,
  ContactData,
  FooterData,
  GalleryData,
  StaffData,
  ReviewsData,
  NewsData,
  AccessData,
  FAQData,
  CTAData,
  PricingData,
  CompanyData
} from '../data/types';

import {
  headerData as defaultHeaderData,
  heroData as defaultHeroData,
  aboutData as defaultAboutData,
  menuData as defaultMenuData,
  storeInfoData as defaultStoreInfoData,
  contactData as defaultContactData,
  footerData as defaultFooterData,
  galleryData as defaultGalleryData,
  staffData as defaultStaffData,
  reviewsData as defaultReviewsData,
  newsData as defaultNewsData,
  accessData as defaultAccessData,
  faqData as defaultFAQData,
  ctaData as defaultCTAData,
  pricingData as defaultPricingData,
  companyData as defaultCompanyData,
} from '../data/content';

export interface PageData {
  header: HeaderData | null;
  hero: HeroData | null;
  about: AboutData | null;
  menu: MenuData | null;
  storeInfo: StoreInfoData | null;
  contact: ContactData | null;
  footer: FooterData | null;
  gallery: GalleryData | null;
  staff: StaffData | null;
  reviews: ReviewsData | null;
  news: NewsData | null;
  access: AccessData | null;
  faq: FAQData | null;
  cta: CTAData | null;
  pricing: PricingData | null;
  company: CompanyData | null;
}

function isNestedStructure(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  return 'header' in data || 'hero' in data || 'menu' in data;
}

function ensureMultilingual(field: any): any {
  if (!field || typeof field !== 'object' || Array.isArray(field)) {
    return field;
  }

  const languages = ['ja', 'en', 'ko', 'zh-tw'];
  const hasLanguageKeys = languages.some(lang => lang in field);

  if (!hasLanguageKeys) {
    return field;
  }

  const result: any = {};
  const availableLanguages = languages.filter(lang => lang in field && field[lang]);

  if (availableLanguages.length === 0) {
    return field;
  }

  const fallbackValue = field[availableLanguages[0]];

  for (const lang of languages) {
    result[lang] = field[lang] || fallbackValue;
  }

  return result;
}

function convertMultilingualFields(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => convertMultilingualFields(item));
  }

  const result: any = {};
  const fieldGroups: { [key: string]: { [lang: string]: any } } = {};

  for (const [key, value] of Object.entries(obj)) {
    const match = key.match(/^(.+)_(ja|en|ko|zh-tw)$/);

    if (match) {
      const [, fieldName, lang] = match;
      if (!fieldGroups[fieldName]) {
        fieldGroups[fieldName] = {};
      }
      fieldGroups[fieldName][lang] = value;
    } else {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = convertMultilingualFields(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map(item => convertMultilingualFields(item));
      } else {
        result[key] = value;
      }
    }
  }

  for (const [fieldName, langs] of Object.entries(fieldGroups)) {
    if (Object.keys(langs).length > 0) {
      result[fieldName] = ensureMultilingual(langs);
    }
  }

  return result;
}

function convertFlatToNested(flatData: any): any {
  const nested: any = {};

  for (const [key, value] of Object.entries(flatData)) {
    const parts = key.split('_');
    let current = nested;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (part === 'Item' && i > 0 && !isNaN(Number(parts[i + 1]))) {
        const arrayKey = parts[i - 1].toLowerCase();
        if (!current[arrayKey]) current[arrayKey] = [];

        const index = parseInt(parts[i + 1]) - 1;
        if (!current[arrayKey][index]) current[arrayKey][index] = {};

        const remainingKey = parts.slice(i + 2).join('_');
        if (remainingKey) {
          current[arrayKey][index][remainingKey] = value;
        }
        break;
      }

      if (part === 'Nav' && i > 0 && !isNaN(Number(parts[i + 1]))) {
        const parentKey = 'navigation';
        if (!current[parentKey]) current[parentKey] = [];

        const index = parseInt(parts[i + 1]) - 1;
        if (!current[parentKey][index]) current[parentKey][index] = {};

        const remainingKey = parts.slice(i + 2).join('_');
        if (remainingKey) {
          current[parentKey][index][remainingKey] = value;
        }
        break;
      }

      const lowerPart = part.charAt(0).toLowerCase() + part.slice(1);
      if (i === 0) {
        if (!current[lowerPart]) current[lowerPart] = {};
        current = current[lowerPart];
      } else {
        if (!current[lowerPart]) current[lowerPart] = {};
        current = current[lowerPart];
      }
    }

    if (parts.length === 2 || (parts.length > 2 && parts[1] !== 'Item' && parts[1] !== 'Nav')) {
      const lastPart = parts[parts.length - 1];
      if (!parts.includes('Item') && !parts.includes('Nav')) {
        current[lastPart] = value;
      }
    }
  }

  return nested;
}

function transformMenuData(menuData: any): MenuData | null {
  if (!menuData) {
    return null;
  }

  const transformed: any = {
    sectionTitle: menuData.sectionTitle || menuData.title,
    sectionSubtitle: menuData.sectionSubtitle || menuData.subtitle,
    description: menuData.description,
  };

  if (menuData.categories && Array.isArray(menuData.categories)) {
    const allItems: any[] = [];
    menuData.categories.forEach((category: any) => {
      if (category.items && Array.isArray(category.items)) {
        category.items.forEach((item: any) => {
          allItems.push({
            ...item,
            category: category.name || category.id
          });
        });
      }
    });
    transformed.items = allItems;
  } else if (menuData.items && Array.isArray(menuData.items)) {
    transformed.items = menuData.items;
  }

  return transformed;
}

function transformContactData(contactData: any): ContactData | null {
  if (!contactData) return null;

  const transformed: any = {
    sectionTitle: contactData.sectionTitle || contactData.title,
    sectionSubtitle: contactData.sectionSubtitle || contactData.subtitle,
    description: contactData.description,
    submitButton: contactData.submitButton || {
      ja: '送信',
      en: 'Send',
      'zh-tw': '發送',
      ko: '보내기'
    },
    fields: {
      name: { ja: '名前', en: 'Name', 'zh-tw': '姓名', ko: '이름' },
      email: { ja: 'メールアドレス', en: 'Email', 'zh-tw': '電子郵件', ko: '이메일' },
      subject: { ja: '件名', en: 'Subject', 'zh-tw': '主題', ko: '제목' },
      message: { ja: 'メッセージ', en: 'Message', 'zh-tw': '訊息', ko: '메시지' }
    }
  };

  if (contactData.methods && Array.isArray(contactData.methods)) {
    transformed.methods = contactData.methods;
  }

  return transformed;
}

function transformGalleryData(galleryData: any): GalleryData | null {
  if (!galleryData) {
    return null;
  }

  const categoryMap: { [key: string]: any } = {
    'すべて': { ja: 'すべて', en: 'All', 'zh-tw': '全部', ko: '전체' },
    '風景': { ja: '風景', en: 'Scenery', 'zh-tw': '風景', ko: '풍景' },
    '商品': { ja: '商品', en: 'Products', 'zh-tw': '商品', ko: '상품' },
    '店舗': { ja: '店舗', en: 'Store', 'zh-tw': '店舖', ko: '매장' }
  };

  const transformed: any = {
    sectionTitle: galleryData.sectionTitle || galleryData.title,
    sectionSubtitle: galleryData.sectionSubtitle || galleryData.subtitle,
    images: galleryData.images ? galleryData.images.map((img: any) => ({
      url: img.url,
      alt: img.alt,
      caption: img.caption,
      category: typeof img.category === 'string'
        ? (categoryMap[img.category] || { ja: img.category, en: img.category, 'zh-tw': img.category, ko: img.category })
        : img.category
    })) : []
  };

  if (galleryData.categories && Array.isArray(galleryData.categories)) {
    transformed.categories = galleryData.categories.map((cat: any) => {
      if (typeof cat === 'string') {
        return categoryMap[cat] || { ja: cat, en: cat, 'zh-tw': cat, ko: cat };
      }
      return cat;
    });
  }

  return transformed;
}

function transformPricingData(pricingData: any): PricingData | null {
  if (!pricingData) {
    return null;
  }

  const transformed: any = {
    sectionTitle: pricingData.sectionTitle,
    sectionSubtitle: pricingData.sectionSubtitle,
    note: pricingData.note,
  };

  if (pricingData.plans && Array.isArray(pricingData.plans)) {
    transformed.plans = pricingData.plans;
  }

  return transformed;
}

function transformStaffData(staffData: any): StaffData | null {
  if (!staffData) {
    return null;
  }

  const transformed: any = {
    sectionTitle: staffData.sectionTitle,
    sectionSubtitle: staffData.sectionSubtitle,
  };

  if (staffData.members && Array.isArray(staffData.members)) {
    transformed.members = staffData.members;
  }

  return transformed;
}

function transformAccessData(accessData: any): AccessData | null {
  if (!accessData) {
    return null;
  }

  const transformed: any = {
    sectionTitle: accessData.sectionTitle || accessData.title,
    sectionSubtitle: accessData.sectionSubtitle || accessData.subtitle,
    address: accessData.address,
    mapEmbedUrl: accessData.mapEmbedUrl,
    hours: accessData.hours
  };

  if (accessData.parking) {
    transformed.parking = accessData.parking;
  }

  if (accessData.transportation) {
    transformed.transportation = accessData.transportation;
  }

  return transformed;
}

export function mapDynamoDBDataToPageData(dynamoData: any): PageData {
  try {
    let contentData = dynamoData;

    if (dynamoData.ContentData) {
      contentData = typeof dynamoData.ContentData === 'string'
        ? JSON.parse(dynamoData.ContentData)
        : dynamoData.ContentData;
    }

    if (!isNestedStructure(contentData)) {
      contentData = convertFlatToNested(contentData);
    }

    contentData = convertMultilingualFields(contentData);

    console.log('🔍 ContentData Structure:', {
      menu: contentData.menu,
      pricing: contentData.pricing,
      staff: contentData.staff,
      gallery: contentData.gallery,
      access: contentData.access
    });

    const extractTranslatedData = (section: any, sectionName: string) => {
      console.log(`🔍 Extracting ${sectionName}:`, section);

      if (!section) {
        console.log(`⚠️ ${sectionName} is null/undefined`);
        return null;
      }

      if (section.translatedData) {
        console.log(`✅ ${sectionName} has translatedData wrapper`);

        if (section.translatedData[sectionName]) {
          console.log(`✅ Found ${sectionName} inside translatedData.${sectionName}`);
          return section.translatedData[sectionName];
        }

        if (section.translatedData.success !== undefined) {
          console.log(`✅ ${sectionName} is already unwrapped in translatedData`);
          return section.translatedData;
        }

        console.log(`⚠️ ${sectionName} translatedData structure is unexpected:`, Object.keys(section.translatedData));
        return section.translatedData;
      }

      if (section.success !== undefined && section[sectionName]) {
        console.log(`✅ ${sectionName} has success flag, extracting ${sectionName} key`);
        return section[sectionName];
      }

      console.log(`✅ ${sectionName} using as-is (no wrapper)`);
      return section;
    };

    const menuData = transformMenuData(contentData.menu);
    const contactData = transformContactData(contentData.contact);
    const galleryData = transformGalleryData(contentData.gallery);
    const pricingData = transformPricingData(contentData.pricing);
    const staffData = transformStaffData(contentData.staff);
    const accessData = transformAccessData(contentData.access);

    const pageData = {
      header: extractTranslatedData(contentData.header, 'header'),
      hero: extractTranslatedData(contentData.hero, 'hero'),
      about: extractTranslatedData(contentData.about, 'about'),
      menu: menuData,
      storeInfo: extractTranslatedData(contentData.storeInfo, 'storeInfo'),
      contact: contactData,
      footer: extractTranslatedData(contentData.footer, 'footer'),
      gallery: galleryData,
      staff: staffData,
      reviews: extractTranslatedData(contentData.reviews, 'reviews'),
      news: extractTranslatedData(contentData.news, 'news'),
      access: accessData,
      faq: extractTranslatedData(contentData.faq, 'faq'),
      cta: extractTranslatedData(contentData.cta, 'cta'),
      pricing: pricingData,
      company: extractTranslatedData(contentData.company, 'company'),
    };

    console.log('📊 DynamoDB Data Mapped:', {
      header: {
        exists: !!pageData.header,
        hasLogo: !!pageData.header?.logo,
        navigationCount: pageData.header?.navigation?.length || 0,
        navigationSample: pageData.header?.navigation?.[0]
      },
      hero: {
        exists: !!pageData.hero,
        hasTitle: !!pageData.hero?.title,
        keys: pageData.hero ? Object.keys(pageData.hero) : []
      },
      about: {
        exists: !!pageData.about,
        keys: pageData.about ? Object.keys(pageData.about) : []
      },
      menu: {
        exists: !!menuData,
        hasTitle: !!menuData?.sectionTitle,
        itemsCount: menuData?.items?.length || 0
      },
      pricing: {
        exists: !!pricingData,
        hasTitle: !!pricingData?.sectionTitle,
        plansCount: pricingData?.plans?.length || 0
      },
      staff: {
        exists: !!staffData,
        hasTitle: !!staffData?.sectionTitle,
        membersCount: staffData?.members?.length || 0
      },
      gallery: {
        exists: !!galleryData,
        hasTitle: !!galleryData?.sectionTitle,
        imagesCount: galleryData?.images?.length || 0
      },
      access: {
        exists: !!accessData,
        hasTitle: !!accessData?.sectionTitle,
        hasAddress: !!accessData?.address
      },
      news: {
        exists: !!pageData.news,
        hasTitle: !!pageData.news?.sectionTitle,
        itemsCount: pageData.news?.items?.length || 0
      },
      reviews: {
        exists: !!pageData.reviews,
        keys: pageData.reviews ? Object.keys(pageData.reviews) : []
      },
      footer: {
        exists: !!pageData.footer,
        keys: pageData.footer ? Object.keys(pageData.footer) : []
      }
    });

    return pageData;
  } catch (error) {
    console.error('Error mapping DynamoDB data:', error);
    return getDefaultPageData();
  }
}

export function getDefaultPageData(): PageData {
  return {
    header: defaultHeaderData,
    hero: defaultHeroData,
    about: defaultAboutData,
    menu: defaultMenuData,
    storeInfo: defaultStoreInfoData,
    contact: defaultContactData,
    footer: defaultFooterData,
    gallery: defaultGalleryData,
    staff: defaultStaffData,
    reviews: defaultReviewsData,
    news: defaultNewsData,
    access: defaultAccessData,
    faq: defaultFAQData,
    cta: defaultCTAData,
    pricing: defaultPricingData,
    company: defaultCompanyData,
  };
}
