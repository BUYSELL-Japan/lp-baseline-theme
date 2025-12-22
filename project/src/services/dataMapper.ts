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

export function mapDynamoDBDataToPageData(dynamoData: any): PageData {
  try {
    let contentData = dynamoData;

    if (dynamoData.ContentData) {
      contentData = typeof dynamoData.ContentData === 'string'
        ? JSON.parse(dynamoData.ContentData)
        : dynamoData.ContentData;
    }

    console.log('Content data for mapping:', contentData);

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
