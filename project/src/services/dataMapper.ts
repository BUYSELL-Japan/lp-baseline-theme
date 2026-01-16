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

function extractImageUrl(value: any): string | null {
  if (!value) return null;

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    if (value.url && typeof value.url === 'string') {
      return value.url;
    }
    if (value.S && typeof value.S === 'string') {
      return value.S;
    }
  }

  return null;
}

function isValidImageUrl(url: any): boolean {
  const extractedUrl = extractImageUrl(url);

  if (!extractedUrl || typeof extractedUrl !== 'string') {
    console.log(`[isValidImageUrl] Could not extract URL from:`, url);
    return false;
  }

  const validDomains = [
    'lp-store-images.s3.ap-southeast-2.amazonaws.com',
    'lp-store-images.s3.amazonaws.com',
    's3.ap-southeast-2.amazonaws.com',
    's3.amazonaws.com',
    'cloudfront.net',
    'd1bgs7tj36vb93.cloudfront.net',
    'images.pexels.com',
    'images.unsplash.com',
    'source.unsplash.com',
  ];

  try {
    const urlObj = new URL(extractedUrl);
    const hostname = urlObj.hostname;

    const isValid = validDomains.some(domain => hostname.includes(domain)) ||
                    extractedUrl.startsWith('https://') ||
                    extractedUrl.startsWith('http://');

    const isS3 = hostname.includes('s3.amazonaws.com') || hostname.includes('lp-store-images');
    console.log(`[isValidImageUrl] URL: ${extractedUrl}, Valid: ${isValid}, IsS3: ${isS3}, Hostname: ${hostname}`);
    return isValid;
  } catch (e) {
    console.log(`[isValidImageUrl] Invalid URL format: ${extractedUrl}`);
    return false;
  }
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
  if (!menuData || typeof menuData !== 'object') {
    console.log('[transformMenuData] Invalid input, returning null');
    return null;
  }

  if (!menuData.sectionTitle && !menuData.title) {
    console.log('[transformMenuData] Missing title, returning null');
    return null;
  }

  const transformed: any = {
    sectionTitle: menuData.sectionTitle || menuData.title,
    sectionSubtitle: menuData.sectionSubtitle || menuData.subtitle,
    description: menuData.description,
    items: []
  };

  if (menuData.categories && Array.isArray(menuData.categories)) {
    const allItems: any[] = [];
    menuData.categories.forEach((category: any) => {
      if (category.items && Array.isArray(category.items)) {
        category.items.forEach((item: any) => {
          const imageUrl = extractImageUrl(item.image);
          console.log('[transformMenuData] Category item raw image:', item.image);
          console.log('[transformMenuData] Category item extracted URL:', imageUrl);

          if (item.image && !isValidImageUrl(item.image)) {
            console.warn(`[transformMenuData] Invalid image URL for item:`, item.name, item.image);
          }

          allItems.push({
            ...item,
            image: imageUrl || item.image,
            category: category.name || category.id
          });
        });
      }
    });
    transformed.items = allItems;
  } else if (menuData.items && Array.isArray(menuData.items)) {
    const processedItems = menuData.items.map((item: any) => {
      const imageUrl = extractImageUrl(item.image);
      console.log('[transformMenuData] Item raw image:', item.image);
      console.log('[transformMenuData] Extracted image URL:', imageUrl);

      if (item.image && !isValidImageUrl(item.image)) {
        console.warn(`[transformMenuData] Invalid image URL for item:`, item.name, item.image);
      }

      return {
        ...item,
        image: imageUrl || item.image
      };
    });
    transformed.items = processedItems;
  }

  if (transformed.items.length === 0) {
    console.log('[transformMenuData] No items found, returning null');
    return null;
  }

  return transformed;
}

function transformContactData(contactData: any): ContactData | null {
  if (!contactData || typeof contactData !== 'object') {
    console.log('[transformContactData] Invalid input, returning null');
    return null;
  }

  if (!contactData.sectionTitle && !contactData.title) {
    console.log('[transformContactData] Missing title, returning null');
    return null;
  }

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
    fields: contactData.fields || {
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
  if (!galleryData || typeof galleryData !== 'object') {
    console.log('[transformGalleryData] Invalid input, returning null');
    return null;
  }

  if (!galleryData.sectionTitle && !galleryData.title) {
    console.log('[transformGalleryData] Missing title, returning null');
    return null;
  }

  const categoryMap: { [key: string]: any } = {
    'すべて': { ja: 'すべて', en: 'All', 'zh-tw': '全部', ko: '전체' },
    '料理': { ja: '料理', en: 'Cuisine', 'zh-tw': '料理', ko: '요리' },
    '店内': { ja: '店内', en: 'Interior', 'zh-tw': '店內', ko: '매장' },
    'イベント': { ja: 'イベント', en: 'Events', 'zh-tw': '活動', ko: '이벤트' }
  };

  const images = galleryData.images && Array.isArray(galleryData.images)
    ? galleryData.images
        .map((img: any) => {
          const imageUrl = extractImageUrl(img.url);
          console.log('[transformGalleryData] Processing image:', img);
          console.log('[transformGalleryData] Raw image URL:', img.url);
          console.log('[transformGalleryData] Extracted image URL:', imageUrl);

          if (!isValidImageUrl(img.url)) {
            console.warn(`[transformGalleryData] Invalid or missing image URL, skipping:`, img.url);
            return null;
          }

          return {
            url: imageUrl || img.url,
            alt: img.alt || img.caption,
            caption: img.caption,
            category: typeof img.category === 'string'
              ? (categoryMap[img.category] || { ja: img.category, en: img.category, 'zh-tw': img.category, ko: img.category })
              : img.category
          };
        })
        .filter((img): img is NonNullable<typeof img> => img !== null)
    : [];

  console.log('[transformGalleryData] Transformed images:', images);

  if (images.length === 0) {
    console.log('[transformGalleryData] No images found, returning null');
    return null;
  }

  const transformed: any = {
    sectionTitle: galleryData.sectionTitle || galleryData.title,
    sectionSubtitle: galleryData.sectionSubtitle || galleryData.subtitle,
    images
  };

  if (galleryData.categories && Array.isArray(galleryData.categories)) {
    const allCategoryVariants = ['すべて', 'All', '全部', '전체', 'all'];
    transformed.categories = galleryData.categories
      .filter((cat: any) => {
        if (typeof cat === 'string') {
          return !allCategoryVariants.includes(cat);
        }
        if (typeof cat === 'object' && cat !== null) {
          const values = Object.values(cat);
          return !values.some(val =>
            typeof val === 'string' && allCategoryVariants.includes(val)
          );
        }
        return true;
      })
      .map((cat: any) => {
        if (typeof cat === 'string') {
          return categoryMap[cat] || { ja: cat, en: cat, 'zh-tw': cat, ko: cat };
        }
        return cat;
      });
  }

  return transformed;
}

function transformPricingData(pricingData: any): PricingData | null {
  if (!pricingData || typeof pricingData !== 'object') {
    console.log('[transformPricingData] Invalid input, returning null');
    return null;
  }

  console.log('[transformPricingData] Input data:', {
    keys: Object.keys(pricingData),
    hasPlans: !!pricingData.plans,
    plansType: Array.isArray(pricingData.plans) ? 'array' : typeof pricingData.plans,
    plansLength: pricingData.plans?.length
  });

  if (!pricingData.sectionTitle && !pricingData.title) {
    console.log('[transformPricingData] Missing title, returning null');
    return null;
  }

  let plans = pricingData.plans && Array.isArray(pricingData.plans) ? pricingData.plans : [];

  if (plans.length === 0) {
    console.log('[transformPricingData] No plans found, returning null');
    return null;
  }

  const transformed: any = {
    sectionTitle: pricingData.sectionTitle || pricingData.title,
    sectionSubtitle: pricingData.sectionSubtitle || pricingData.subtitle,
    note: pricingData.note,
    plans
  };

  console.log('[transformPricingData] Transformed output:', {
    hasTitle: !!transformed.sectionTitle,
    plansCount: transformed.plans?.length
  });

  return transformed;
}

function transformStaffData(staffData: any): StaffData | null {
  if (!staffData || typeof staffData !== 'object') {
    console.log('[transformStaffData] Invalid input, returning null');
    return null;
  }

  console.log('[transformStaffData] Input data:', {
    keys: Object.keys(staffData),
    hasMembers: !!staffData.members,
    membersType: Array.isArray(staffData.members) ? 'array' : typeof staffData.members,
    membersLength: staffData.members?.length
  });

  if (!staffData.sectionTitle && !staffData.title) {
    console.log('[transformStaffData] Missing title, returning null');
    return null;
  }

  let members = staffData.members && Array.isArray(staffData.members) ? staffData.members : [];

  if (members.length === 0) {
    console.log('[transformStaffData] No members found, returning null');
    return null;
  }

  const processedMembers = members.map((member: any, index: number) => {
    const imageUrl = extractImageUrl(member.image);
    console.log(`[transformStaffData] Member ${index} raw image:`, member.image);
    console.log(`[transformStaffData] Member ${index} extracted URL:`, imageUrl);

    if (member.image && !isValidImageUrl(member.image)) {
      console.warn(`[transformStaffData] Invalid image URL for member ${index}:`, member.name, member.image);
    }

    return {
      ...member,
      image: imageUrl || member.image
    };
  });

  const transformed: any = {
    sectionTitle: staffData.sectionTitle || staffData.title,
    sectionSubtitle: staffData.sectionSubtitle || staffData.subtitle,
    members: processedMembers
  };

  console.log('[transformStaffData] Transformed output:', {
    hasTitle: !!transformed.sectionTitle,
    membersCount: transformed.members?.length
  });

  return transformed;
}

function transformStoreInfoData(storeInfoData: any): StoreInfoData | null {
  if (!storeInfoData || typeof storeInfoData !== 'object') {
    console.log('[transformStoreInfoData] Invalid input, returning null');
    return null;
  }

  console.log('[transformStoreInfoData] Input data:', {
    keys: Object.keys(storeInfoData),
    hasItems: !!storeInfoData.items,
    itemsType: Array.isArray(storeInfoData.items) ? 'array' : typeof storeInfoData.items,
    itemsLength: storeInfoData.items?.length,
    firstItem: storeInfoData.items?.[0]
  });

  if (!storeInfoData.sectionTitle && !storeInfoData.title) {
    console.log('[transformStoreInfoData] Missing title, returning null');
    return null;
  }

  let items = storeInfoData.items && Array.isArray(storeInfoData.items) ? storeInfoData.items : [];

  if (items.length === 0) {
    console.log('[transformStoreInfoData] No items found, returning null');
    return null;
  }

  const iconMapping = [
    { icon: 'MapPin', title: { ja: '所在地', en: 'Address', 'zh-tw': '地址', ko: '주소' } },
    { icon: 'Clock', title: { ja: '営業時間', en: 'Business Hours', 'zh-tw': '營業時間', ko: '영업 시간' } },
    { icon: 'Phone', title: { ja: '電話番号', en: 'Phone', 'zh-tw': '電話', ko: '전화' } },
    { icon: 'Mail', title: { ja: 'メール', en: 'Email', 'zh-tw': '電子郵件', ko: '이메일' } }
  ];

  const transformedItems = items.map((item: any, index: number) => {
    if (item.icon && item.title && item.content) {
      console.log(`[transformStoreInfoData] Item ${index} already structured`);
      return item;
    }

    const languages = ['ja', 'en', 'ko', 'zh-tw'];
    const hasLanguageKeys = typeof item === 'object' && item !== null && !Array.isArray(item)
      ? languages.some(lang => lang in item)
      : false;

    if (hasLanguageKeys && index < iconMapping.length) {
      console.log(`[transformStoreInfoData] Item ${index} is plain multilingual text, converting to structured format`);
      const mapping = iconMapping[index];
      return {
        icon: mapping.icon,
        title: mapping.title,
        content: item
      };
    }

    console.log(`[transformStoreInfoData] Item ${index} format unknown, using as-is`);
    return item;
  });

  const transformed: any = {
    sectionTitle: storeInfoData.sectionTitle || storeInfoData.title,
    sectionSubtitle: storeInfoData.sectionSubtitle || storeInfoData.subtitle,
    mainImage: storeInfoData.mainImage,
    mainImageCaption: storeInfoData.mainImageCaption,
    items: transformedItems
  };

  console.log('[transformStoreInfoData] Transformed output:', {
    hasTitle: !!transformed.sectionTitle,
    itemsCount: transformed.items?.length,
    firstItemStructure: transformed.items?.[0]
  });

  return transformed;
}

function transformAccessData(accessData: any): AccessData | null {
  if (!accessData || typeof accessData !== 'object') {
    console.log('[transformAccessData] Invalid input, returning null');
    return null;
  }

  if (!accessData.sectionTitle && !accessData.title) {
    console.log('[transformAccessData] Missing title, returning null');
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

function transformReviewsData(reviewsData: any): ReviewsData | null {
  if (!reviewsData || typeof reviewsData !== 'object') {
    console.log('[transformReviewsData] Invalid input, returning null');
    return null;
  }

  console.log('[transformReviewsData] Input data:', {
    keys: Object.keys(reviewsData),
    hasReviews: !!reviewsData.reviews,
    reviewsType: Array.isArray(reviewsData.reviews) ? 'array' : typeof reviewsData.reviews,
    reviewsLength: reviewsData.reviews?.length
  });

  if (!reviewsData.sectionTitle && !reviewsData.title) {
    console.log('[transformReviewsData] Missing title, returning null');
    return null;
  }

  let reviews = reviewsData.reviews && Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];

  if (reviews.length === 0) {
    console.log('[transformReviewsData] No reviews found, returning null');
    return null;
  }

  const transformed: any = {
    sectionTitle: reviewsData.sectionTitle || reviewsData.title,
    sectionSubtitle: reviewsData.sectionSubtitle || reviewsData.subtitle,
    reviews
  };

  console.log('[transformReviewsData] Transformed output:', {
    hasTitle: !!transformed.sectionTitle,
    reviewsCount: transformed.reviews?.length
  });

  return transformed;
}

export function mapDynamoDBDataToPageData(dynamoData: any): PageData {
  try {
    console.log('[mapDynamoDBDataToPageData] Input dynamoData:', {
      keys: Object.keys(dynamoData || {}),
      hasContentData: !!dynamoData?.ContentData,
      contentDataType: typeof dynamoData?.ContentData
    });

    let contentData = dynamoData;

    if (dynamoData.ContentData) {
      contentData = typeof dynamoData.ContentData === 'string'
        ? JSON.parse(dynamoData.ContentData)
        : dynamoData.ContentData;
      console.log('[mapDynamoDBDataToPageData] ContentData extracted, keys:', Object.keys(contentData || {}));
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

      if (!section || typeof section !== 'object') {
        console.log(`⚠️ ${sectionName} is null/undefined or not an object`);
        return null;
      }

      let extractedData: any = null;

      if (section.translatedData) {
        console.log(`✅ ${sectionName} has translatedData wrapper`);

        if (section.translatedData[sectionName]) {
          console.log(`✅ Found ${sectionName} inside translatedData.${sectionName}`);
          extractedData = section.translatedData[sectionName];
        } else if (section.translatedData.success !== undefined) {
          console.log(`✅ ${sectionName} is already unwrapped in translatedData`);
          const { success, ...rest } = section.translatedData;
          extractedData = rest;
        } else {
          console.log(`⚠️ ${sectionName} translatedData structure is unexpected:`, Object.keys(section.translatedData));
          extractedData = section.translatedData;
        }

        const topLevelArrayKeys = ['items', 'reviews', 'members', 'images', 'plans', 'features', 'navigation'];
        const topLevelData: any = {};
        let hasTopLevelData = false;

        for (const key of topLevelArrayKeys) {
          if (section[key] !== undefined && section[key] !== null) {
            console.log(`✅ Merging top-level ${key} into ${sectionName}`);
            topLevelData[key] = section[key];
            hasTopLevelData = true;
          }
        }

        if (hasTopLevelData) {
          extractedData = { ...extractedData, ...topLevelData };
          console.log(`✅ Merged data for ${sectionName}:`, Object.keys(extractedData));
        }
      } else if (section.success !== undefined && section[sectionName]) {
        console.log(`✅ ${sectionName} has success flag, extracting ${sectionName} key`);
        extractedData = section[sectionName];
      } else {
        console.log(`✅ ${sectionName} using as-is (no wrapper)`);
        extractedData = section;
      }

      if (!extractedData || (typeof extractedData === 'object' && Object.keys(extractedData).length === 0)) {
        console.log(`⚠️ ${sectionName} extracted data is empty, returning null`);
        return null;
      }

      const doubleNestedKeys = ['reviews', 'items', 'members', 'plans', 'images', 'features'];
      for (const key of doubleNestedKeys) {
        if (extractedData[key] && extractedData[key][key] && Array.isArray(extractedData[key][key])) {
          console.log(`🔧 ${sectionName}: Fixing double-nested ${key} (${key}.${key})`);
          extractedData[key] = extractedData[key][key];
        }
      }

      console.log(`✅ ${sectionName} final extracted data:`, {
        keys: Object.keys(extractedData),
        hasItems: !!extractedData.items,
        hasReviews: !!extractedData.reviews,
        hasMembers: !!extractedData.members,
        hasPlans: !!extractedData.plans,
        itemsCount: extractedData.items?.length,
        reviewsCount: extractedData.reviews?.length,
        membersCount: extractedData.members?.length,
        plansCount: extractedData.plans?.length,
      });

      return extractedData;
    };

    const defaultData = getDefaultPageData();

    const heroExtracted = extractTranslatedData(contentData.hero, 'hero');
    if (heroExtracted?.backgroundImage) {
      const heroImageUrl = extractImageUrl(heroExtracted.backgroundImage);
      console.log('[mapDynamoDBDataToPageData] Hero raw backgroundImage:', heroExtracted.backgroundImage);
      console.log('[mapDynamoDBDataToPageData] Hero extracted backgroundImage:', heroImageUrl);

      if (!isValidImageUrl(heroExtracted.backgroundImage)) {
        console.warn('[mapDynamoDBDataToPageData] Invalid hero backgroundImage URL:', heroExtracted.backgroundImage);
      }

      if (heroImageUrl) {
        heroExtracted.backgroundImage = heroImageUrl;
      }
    }

    const storeInfoExtracted = extractTranslatedData(contentData.storeInfo, 'storeInfo');
    if (storeInfoExtracted?.mainImage) {
      const storeInfoImageUrl = extractImageUrl(storeInfoExtracted.mainImage);
      console.log('[mapDynamoDBDataToPageData] StoreInfo raw mainImage:', storeInfoExtracted.mainImage);
      console.log('[mapDynamoDBDataToPageData] StoreInfo extracted mainImage:', storeInfoImageUrl);

      if (storeInfoImageUrl) {
        storeInfoExtracted.mainImage = storeInfoImageUrl;
      }
    }

    const menuData = transformMenuData(extractTranslatedData(contentData.menu, 'menu'));
    const contactData = transformContactData(extractTranslatedData(contentData.contact, 'contact'));
    const galleryData = transformGalleryData(extractTranslatedData(contentData.gallery, 'gallery'));
    const pricingData = transformPricingData(extractTranslatedData(contentData.pricing, 'pricing'));
    const staffData = transformStaffData(extractTranslatedData(contentData.staff, 'staff'));
    const storeInfoData = transformStoreInfoData(storeInfoExtracted);
    const accessData = transformAccessData(extractTranslatedData(contentData.access, 'access'));
    const reviewsDataTransformed = transformReviewsData(extractTranslatedData(contentData.reviews, 'reviews'));

    let footerExtracted = extractTranslatedData(contentData.footer, 'footer');

    if (footerExtracted && footerExtracted.social) {
      if (Array.isArray(footerExtracted.social)) {
        console.log('[mapDynamoDBDataToPageData] Footer social is array, converting to object with links');
        footerExtracted.social = {
          title: footerExtracted.socialTitle || { ja: 'SNSでフォロー', en: 'Follow Us', 'zh-tw': '追蹤我們', ko: '팔로우' },
          links: footerExtracted.social
        };
      } else if (footerExtracted.social.links && Array.isArray(footerExtracted.social.links)) {
        console.log('[mapDynamoDBDataToPageData] Footer social.links is already correct format');
      } else {
        console.log('[mapDynamoDBDataToPageData] Footer social structure unexpected:', footerExtracted.social);
      }
    }

    const pageData = {
      header: extractTranslatedData(contentData.header, 'header') || defaultData.header,
      hero: heroExtracted || defaultData.hero,
      about: extractTranslatedData(contentData.about, 'about') || defaultData.about,
      menu: menuData || defaultData.menu,
      storeInfo: storeInfoData || defaultData.storeInfo,
      contact: contactData || defaultData.contact,
      footer: footerExtracted || defaultData.footer,
      gallery: galleryData || defaultData.gallery,
      staff: staffData || defaultData.staff,
      reviews: reviewsDataTransformed || defaultData.reviews,
      news: extractTranslatedData(contentData.news, 'news') || defaultData.news,
      access: accessData || defaultData.access,
      faq: extractTranslatedData(contentData.faq, 'faq') || defaultData.faq,
      cta: extractTranslatedData(contentData.cta, 'cta') || defaultData.cta,
      pricing: pricingData || defaultData.pricing,
      company: extractTranslatedData(contentData.company, 'company') || defaultData.company,
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
        hasTitle: !!pageData.reviews?.sectionTitle,
        reviewsCount: pageData.reviews?.reviews?.length || 0,
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
