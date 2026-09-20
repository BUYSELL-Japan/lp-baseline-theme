import fs from 'fs';
import path from 'path';

const THEME_NAME = 'brush';
const CAPITALIZED_THEME = 'Brush';
const SOURCE_THEME = 'kura'; // Use kura as baseline for copying

const BASE_DIR = path.resolve('src/components/themes');
const SOURCE_DIR = path.join(BASE_DIR, SOURCE_THEME);
const TARGET_DIR = path.join(BASE_DIR, THEME_NAME);

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// 1. Copy and rename components
const components = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.tsx'));
components.forEach(comp => {
  let content = fs.readFileSync(path.join(SOURCE_DIR, comp), 'utf-8');
  
  // Base replacements to set up typography
  // Headings -> font-serif font-black text-[#1a1a1a]
  // General text -> font-sans text-[#1a1a1a]
  content = content.replace(/font-sans/g, 'font-serif'); // Convert many things to serif first, we will refine later
  
  // Write the file
  fs.writeFileSync(path.join(TARGET_DIR, comp), content);
});
console.log(`Copied components to ${TARGET_DIR}`);

// 2. Create ThemeBrushStorePage.tsx
const pageContent = `import React from 'react';
import { PageDataProvider } from '../../contexts/PageDataContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Header from './brush/Header';
import Hero from './brush/Hero';
import Menu from './brush/Menu';
import About from './brush/About';
import Gallery from './brush/Gallery';
import Pricing from './brush/Pricing';
import Staff from './brush/Staff';
import Company from './brush/Company';
import StoreInfo from './brush/StoreInfo';
import Access from './brush/Access';
import FAQ from './brush/FAQ';
import News from './brush/News';
import Contact from './brush/Contact';
import CTA from './brush/CTA';
import Footer from './brush/Footer';

export default function ThemeBrushStorePage({ initialData, initialLanguage, showDemoBanner = false }: { initialData: any, initialLanguage: string, showDemoBanner?: boolean }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageDataProvider data={initialData}>
        <div className="font-sans text-[#1a1a1a] bg-[#F5F0E8] min-h-screen">
          {showDemoBanner && (
            <div className="fixed top-0 left-0 w-full bg-black text-white text-center py-2 z-50 font-bold text-sm">
              Theme Demo: Brush (和の力強さ・筆文字)
            </div>
          )}
          <Header />
          <main className={showDemoBanner ? "pt-10" : ""}>
            <Hero />
            <Menu />
            <About />
            <Gallery />
            <Pricing />
            <Staff />
            <Company />
            <StoreInfo />
            <Access />
            <FAQ />
            <News />
            <Contact />
            <CTA />
          </main>
          <Footer />
        </div>
      </PageDataProvider>
    </LanguageProvider>
  );
}
`;
fs.writeFileSync(path.resolve(`src/components/Theme${CAPITALIZED_THEME}StorePage.tsx`), pageContent);
console.log(`Created Theme${CAPITALIZED_THEME}StorePage.tsx`);

// 3. Create demo page
const demoContent = `---
import Layout from '../../layouts/Layout.astro';
import Theme${CAPITALIZED_THEME}StorePage from '../../components/Theme${CAPITALIZED_THEME}StorePage';
import { heroData, aboutData, menuData, storeInfoData, contactData, footerData, galleryData, accessData, newsData, faqData, staffData, pricingData, companyData, ctaData } from '../../data/content';

// Mock data
const mockData = {
  theme: '${THEME_NAME}',
  hero: heroData,
  about: aboutData,
  menu: menuData,
  storeInfo: storeInfoData,
  contact: contactData,
  footer: footerData,
  gallery: galleryData,
  access: accessData,
  news: newsData,
  faq: faqData,
  staff: staffData,
  pricing: pricingData,
  company: companyData,
  cta: ctaData
};
---

<Layout title="Brush Theme Demo">
  <Theme${CAPITALIZED_THEME}StorePage client:load initialData={mockData} initialLanguage="ja" showDemoBanner={true} />
</Layout>
`;
fs.writeFileSync(path.resolve(`src/pages/demo/${THEME_NAME}.astro`), demoContent);
console.log(`Created src/pages/demo/${THEME_NAME}.astro`);
