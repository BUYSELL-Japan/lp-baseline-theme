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
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  menu: MenuData;
  storeInfo: StoreInfoData;
  contact: ContactData;
  footer: FooterData;
  gallery: GalleryData;
  staff: StaffData;
  reviews: ReviewsData;
  news: NewsData;
  access: AccessData;
  faq: FAQData;
  cta: CTAData;
  pricing: PricingData;
  company: CompanyData;
}

export function mapDynamoDBDataToPageData(dynamoData: any): PageData {
  try {
    const parsedData = typeof dynamoData === 'string' ? JSON.parse(dynamoData) : dynamoData;

    return {
      header: parsedData.header || defaultHeaderData,
      hero: parsedData.hero || defaultHeroData,
      about: parsedData.about || defaultAboutData,
      menu: parsedData.menu || defaultMenuData,
      storeInfo: parsedData.storeInfo || defaultStoreInfoData,
      contact: parsedData.contact || defaultContactData,
      footer: parsedData.footer || defaultFooterData,
      gallery: parsedData.gallery || defaultGalleryData,
      staff: parsedData.staff || defaultStaffData,
      reviews: parsedData.reviews || defaultReviewsData,
      news: parsedData.news || defaultNewsData,
      access: parsedData.access || defaultAccessData,
      faq: parsedData.faq || defaultFAQData,
      cta: parsedData.cta || defaultCTAData,
      pricing: parsedData.pricing || defaultPricingData,
      company: parsedData.company || defaultCompanyData,
    };
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
