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
    let contentData = dynamoData;

    if (dynamoData.ContentData) {
      contentData = typeof dynamoData.ContentData === 'string'
        ? JSON.parse(dynamoData.ContentData)
        : dynamoData.ContentData;
    }

    console.log('Content data for mapping:', contentData);

    return {
      header: contentData.header || defaultHeaderData,
      hero: contentData.hero || defaultHeroData,
      about: contentData.about || defaultAboutData,
      menu: contentData.menu || defaultMenuData,
      storeInfo: contentData.storeInfo || defaultStoreInfoData,
      contact: contentData.contact || defaultContactData,
      footer: contentData.footer || defaultFooterData,
      gallery: contentData.gallery || defaultGalleryData,
      staff: contentData.staff || defaultStaffData,
      reviews: contentData.reviews || defaultReviewsData,
      news: contentData.news || defaultNewsData,
      access: contentData.access || defaultAccessData,
      faq: contentData.faq || defaultFAQData,
      cta: contentData.cta || defaultCTAData,
      pricing: contentData.pricing || defaultPricingData,
      company: contentData.company || defaultCompanyData,
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
