export interface LocalizedText {
  ja: string;
  en: string;
  zh: string;
  ko: string;
}

export interface HeaderData {
  logo: {
    text: string;
  };
  navigation: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface AboutFeature {
  title: string;
  description: string;
  image: string;
}

export interface AboutData {
  sectionTitle: string;
  features: AboutFeature[];
}

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface MenuData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: MenuItem[];
}

export interface StoreInfoItem {
  icon: string;
  title: string;
  content: string;
}

export interface StoreInfoData {
  sectionTitle: string;
  items: StoreInfoItem[];
  mainImage: string;
  mainImageCaption: string;
}

export interface ContactData {
  sectionTitle: string;
  sectionSubtitle: string;
  fields: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  submitButton: string;
}

export interface FooterData {
  logo: string;
  description: LocalizedText | string;
  businessHours: {
    title: LocalizedText | string;
    days: LocalizedText | string;
    hours: LocalizedText | string;
    closedDay: LocalizedText | string;
  };
  social: {
    title: LocalizedText | string;
    links: SocialLink[];
  };
  copyright: LocalizedText | string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

export interface GalleryData {
  sectionTitle: string;
  sectionSubtitle: string;
  categories: string[];
  images: GalleryImage[];
}

export interface StaffMember {
  name: LocalizedText | string;
  role: LocalizedText | string;
  description: LocalizedText | string;
  image: string;
}

export interface StaffData {
  sectionTitle: string;
  sectionSubtitle: string;
  members: StaffMember[];
}

export interface Review {
  name: LocalizedText | string;
  rating: number;
  comment: LocalizedText | string;
  date: LocalizedText | string;
  avatar: string;
}

export interface ReviewsData {
  sectionTitle: string;
  sectionSubtitle: string;
  reviews: Review[];
}

export interface NewsItem {
  date: LocalizedText | string;
  category: LocalizedText | string;
  title: LocalizedText | string;
  content: LocalizedText | string;
}

export interface NewsData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: NewsItem[];
}

export interface AccessData {
  sectionTitle: string;
  sectionSubtitle: string;
  address: string;
  mapEmbedUrl: string;
  parking: {
    title: string;
    description: string;
    spaces: string;
    notes: string;
  };
  transportation: {
    title: string;
    methods: TransportMethod[];
  };
}

export interface TransportMethod {
  type: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: FAQItem[];
}

export interface CTAData {
  sectionTitle: string;
  sectionSubtitle: string;
  description: string;
  buttons: CTAButton[];
  backgroundImage: string;
}

export interface CTAButton {
  text: LocalizedText | string;
  link: string;
  type: 'primary' | 'secondary';
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface PricingData {
  sectionTitle: string;
  sectionSubtitle: string;
  plans: PricingPlan[];
  note?: string;
}

export interface CompanyData {
  sectionTitle: string;
  sectionSubtitle: string;
  philosophy: {
    title: string;
    content: string;
  };
  history: {
    title: string;
    timeline: HistoryItem[];
  };
  companyInfo: {
    title: string;
    items: CompanyInfoItem[];
  };
}

export interface HistoryItem {
  year: LocalizedText | string;
  event: LocalizedText | string;
}

export interface CompanyInfoItem {
  label: LocalizedText | string;
  value: LocalizedText | string;
}
