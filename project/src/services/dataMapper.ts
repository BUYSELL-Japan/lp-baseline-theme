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

export function mapDynamoDBDataToPageData(dynamoData: any): PageData {
  try {
    let contentData = dynamoData;

    if (dynamoData.ContentData) {
      contentData = typeof dynamoData.ContentData === 'string'
        ? JSON.parse(dynamoData.ContentData)
        : dynamoData.ContentData;
    }

    console.log('Content data for mapping:', contentData);

    if (!isNestedStructure(contentData)) {
      console.log('Converting flat structure to nested');
      contentData = convertFlatToNested(contentData);
      console.log('Converted nested data:', contentData);
    }

    return {
      header: contentData.header || null,
      hero: contentData.hero || null,
      about: contentData.about || null,
      menu: contentData.menu || null,
      storeInfo: contentData.storeInfo || null,
      contact: contentData.contact || null,
      footer: contentData.footer || null,
      gallery: contentData.gallery || null,
      staff: contentData.staff || null,
      reviews: contentData.reviews || null,
      news: contentData.news || null,
      access: contentData.access || null,
      faq: contentData.faq || null,
      cta: contentData.cta || null,
      pricing: contentData.pricing || null,
      company: contentData.company || null,
    };
  } catch (error) {
    console.error('Error mapping DynamoDB data:', error);
    return getDefaultPageData();
  }
}

export function getDefaultPageData(): PageData {
  return {
    header: null,
    hero: null,
    about: null,
    menu: null,
    storeInfo: null,
    contact: null,
    footer: null,
    gallery: null,
    staff: null,
    reviews: null,
    news: null,
    access: null,
    faq: null,
    cta: null,
    pricing: null,
    company: null,
  };
}
