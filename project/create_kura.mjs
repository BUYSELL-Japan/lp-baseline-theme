import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src/components/themes/warm';
const DEST_DIR = 'src/components/themes/kura';

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// 1. Copy basic sections with color replacements
const filesToCopy = [
  'Access.tsx', 'Company.tsx', 'Contact.tsx', 'CTA.tsx', 
  'FAQ.tsx', 'Footer.tsx', 'Header.tsx', 'News.tsx', 
  'Pricing.tsx', 'Reviews.tsx', 'Staff.tsx', 'StoreInfo.tsx'
];

const colorReplacements = [
  { from: /#92400E/g, to: '#1a1a1a' }, // Warm Main -> Kura Sumi
  { from: /#D97706/g, to: '#C0392B' }, // Warm Accent -> Kura Shu
  { from: /#FFFBF0/g, to: '#FFFFFF' }, // Warm Base -> Kura White
  { from: /#FEF3C7/g, to: '#F5F0E8' }, // Warm Contrast -> Kura Washi
  { from: /#1C1917/g, to: '#2D2D2D' }, // Text
];

for (const file of filesToCopy) {
  const srcPath = path.join(SRC_DIR, file);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    for (const r of colorReplacements) {
      content = content.replace(r.from, r.to);
    }
    // Change basic typography
    content = content.replace(/font-black/g, 'font-medium font-serif tracking-widest');
    content = content.replace(/font-bold/g, 'font-medium font-serif tracking-wider');
    
    // Add extra padding for 'Ma'
    content = content.replace(/py-20|py-24/g, 'py-32 md:py-48');
    
    fs.writeFileSync(path.join(DEST_DIR, file), content);
  }
}

// 2. Create Custom Hero
const heroCode = `import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData, useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Hero() {
  const heroData = useHeroData();
  const storeInfo = useStoreInfoData();
  const { language } = useLanguage();

  if (!heroData) return <SectionError sectionName="Hero" error="No hero data available" data={heroData} />;

  const title = getLocalizedValue(heroData, 'title', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);
  const storeName = storeInfo ? getLocalizedValue(storeInfo, 'sectionTitle', language) : '';

  if (!title) return <SectionError sectionName="Hero" error="Missing title" data={heroData} />;

  return (
    <section id="hero" className="relative w-full min-h-screen bg-[#FFFFFF] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile: Horizontal, PC: Right 30% Text, Left 70% Image */}
      
      {/* PC Text Area (Right 30%) & Mobile Text Area (Top) */}
      <div className="w-full md:w-[30%] order-2 md:order-2 flex flex-col justify-center items-center md:items-end py-20 px-8 md:px-16 md:py-32 bg-[#FFFFFF] z-10">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex flex-col md:flex-row-reverse items-center md:items-start gap-8 md:gap-16"
        >
          {/* Vertical text on PC, horizontal on Mobile */}
          {storeName && (
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#1a1a1a] tracking-[0.3em] md:[writing-mode:vertical-rl] leading-loose whitespace-nowrap">
              {storeName}
            </h1>
          )}
          <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-8 md:[writing-mode:vertical-rl]">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#1a1a1a] tracking-[0.3em] leading-[2.5]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg md:text-xl font-serif text-[#C0392B] tracking-[0.2em] leading-loose mt-6 md:mt-0">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Image Area (Left 70%) */}
      <div className="w-full md:w-[70%] h-[60vh] md:h-screen order-1 md:order-1 relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          {heroData.backgroundImage ? (
            <img 
              src={heroData.backgroundImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center">
              <span className="text-[#1a1a1a] font-serif">Image</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'Hero.tsx'), heroCode);

// 3. Create Custom Menu (Zigzag Full-width Cards)
const menuCode = `import React from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();

  if (!menuData) return <SectionError sectionName="Menu" error="No menu data available" data={menuData} />;
  
  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language);
  if (!sectionTitle) return <SectionError sectionName="Menu" error="Missing section title" data={menuData} />;

  if (!menuData.items || menuData.items.length === 0) {
    return <SectionError sectionName="Menu" error="No menu items found." data={menuData} />;
  }

  return (
    <section id="menu" className="py-32 md:py-48 bg-[#FAFAF7]">
      <div className="w-full px-6 md:px-0">
        <div className="text-center mb-32 md:mb-48">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em]">
            {sectionTitle}
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48">
          {menuData.items.map((item, itemIndex) => {
            const itemName = getLocalizedValue(item, 'name', language);
            const isEven = itemIndex % 2 === 0;
            return (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className={\`flex flex-col \${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-12 md:gap-0 w-full max-w-none\`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px]">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={itemName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F5F0E8]"></div>
                  )}
                </div>
                
                {/* Text */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-8">
                  <h3 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] tracking-widest mb-10">
                    {itemName}
                  </h3>
                  {item.description && (
                    <p className="text-lg text-[#2D2D2D] font-sans font-light leading-[2.5] mb-12">
                      {getLocalizedValue(item, 'description', language)}
                    </p>
                  )}
                  <div className="text-2xl font-serif text-[#C0392B] tracking-wider mt-auto">
                    {item.price}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'Menu.tsx'), menuCode);

// 4. Create Custom About
const aboutCode = `import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();
  
  if (!aboutData) return <SectionError sectionName="About" error="No about data available" data={aboutData} />;
  
  const sectionTitle = getLocalizedValue(aboutData, 'sectionTitle', language);
  if (!sectionTitle) return <SectionError sectionName="About" error="Missing section title" data={aboutData} />;

  if (!aboutData.features || !Array.isArray(aboutData.features) || aboutData.features.length === 0) {
    return <SectionError sectionName="About" error="Missing about features data" data={aboutData} />;
  }

  return (
    <section id="about" className="py-32 md:py-48 bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-32 md:mb-48">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em]">
            {sectionTitle}
          </h2>
        </div>

        <div className="space-y-40 md:space-y-64">
          {aboutData.features.map((feature, index) => {
            const title = getLocalizedValue(feature, 'title', language);
            const desc = getLocalizedValue(feature, 'description', language);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center text-center"
              >
                {/* Circular Image with Gold Border */}
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[1px] border-[#B8960C] p-4 md:p-6 mb-16 md:mb-24">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#F5F0E8]">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={title || ''} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center">
                         <span className="text-[#1a1a1a] font-serif">Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="max-w-2xl mx-auto">
                  {title && (
                    <h3 className="text-2xl md:text-4xl font-serif text-[#1a1a1a] tracking-[0.15em] mb-12">
                      {title}
                    </h3>
                  )}
                  {desc && (
                    <div className="text-[#2D2D2D] font-sans font-light leading-[2.5] text-lg md:text-xl space-y-6 text-justify md:text-center">
                      {desc.split('\\n').map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'About.tsx'), aboutCode);

// 5. Create Custom Gallery
const galleryCode = `import React from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import { motion } from 'framer-motion';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  if (!galleryData || !galleryData.images || galleryData.images.length === 0) return null;
  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language) || 'Gallery';

  return (
    <section id="gallery" className="py-32 md:py-48 bg-[#FAFAF7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24 md:mb-32">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em]">
            {sectionTitle}
          </h2>
        </div>
        
        {/* PC: 2-column grid, Mobile: 1-column stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-px md:bg-[#1a1a1a] border border-transparent md:border-[#1a1a1a] p-px">
          {galleryData.images.map((img, index) => {
            const caption = getLocalizedValue(img, 'caption', language);
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="group relative aspect-square bg-[#FFFFFF] overflow-hidden"
              >
                <img 
                  src={img.url} 
                  alt={caption || ''} 
                  className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  loading="lazy"
                />
                {caption && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <h3 className="text-[#FFFFFF] font-serif tracking-widest text-xl">{caption}</h3>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'Gallery.tsx'), galleryCode);

// 6. Create ThemeKuraStorePage.tsx
const pageCode = `import React, { useEffect, useState } from 'react';
import type { PageData } from '../../services/dataMapper';
import { PageDataProvider } from '../../contexts/PageDataContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

import Header from './themes/kura/Header';
import Hero from './themes/kura/Hero';
import About from './themes/kura/About';
import Menu from './themes/kura/Menu';
import StoreInfo from './themes/kura/StoreInfo';
import Contact from './themes/kura/Contact';
import Footer from './themes/kura/Footer';
import Gallery from './themes/kura/Gallery';
import Staff from './themes/kura/Staff';
import Reviews from './themes/kura/Reviews';
import News from './themes/kura/News';
import Access from './themes/kura/Access';
import FAQ from './themes/kura/FAQ';
import CTA from './themes/kura/CTA';
import Pricing from './themes/kura/Pricing';
import Company from './themes/kura/Company';

interface ThemeKuraStorePageProps {
  pageData: PageData;
  initialLanguage?: string;
  basePath?: string;
}

export default function ThemeKuraStorePage({ pageData, initialLanguage = 'ja', basePath }: ThemeKuraStorePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFFFFF]" />;
  }

  const fonts = \`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500&family=Noto+Sans+JP:wght@300;400&display=swap');
    :root {
      --font-serif: 'Noto Serif JP', serif;
      --font-sans: 'Noto Sans JP', sans-serif;
    }
    .font-serif {
      font-family: var(--font-serif);
    }
    .font-sans {
      font-family: var(--font-sans);
    }
    body {
      background-color: #FFFFFF;
      color: #2D2D2D;
    }
  \`;

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageDataProvider data={pageData}>
        <style>{fonts}</style>
        <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-[#F5F0E8] selection:text-[#1a1a1a]">
          {pageData.header && <Header />}
          <main>
            {pageData.hero && <Hero />}
            {pageData.about && <About />}
            {pageData.menu && <Menu />}
            {pageData.pricing && <Pricing />}
            {pageData.staff && <Staff />}
            {pageData.gallery && <Gallery />}
            {pageData.reviews && <Reviews />}
            {pageData.company && <Company />}
            {pageData.storeInfo && <StoreInfo />}
            {pageData.access && <Access />}
            {pageData.faq && <FAQ />}
            {pageData.news && <News />}
            {pageData.contact && <Contact />}
            {pageData.cta && <CTA />}
          </main>
          {pageData.footer && <Footer />}
        </div>
      </PageDataProvider>
    </LanguageProvider>
  );
}
`;
fs.writeFileSync('src/components/ThemeKuraStorePage.tsx', pageCode);

// 7. Create demo/kura.astro
const astroCode = `---
import Layout from '../../layouts/Layout.astro';
import ThemeKuraStorePage from '../../components/ThemeKuraStorePage';
import * as mockData from '../../data/content';
import type { PageData } from '../../services/dataMapper';

const pageData: PageData = {
  header: mockData.headerData,
  hero: mockData.heroData,
  about: mockData.aboutData,
  menu: mockData.menuData,
  storeInfo: mockData.storeInfoData,
  contact: mockData.contactData,
  footer: mockData.footerData,
  gallery: mockData.galleryData,
  staff: mockData.staffData,
  reviews: mockData.reviewsData,
  news: mockData.newsData,
  access: mockData.accessData,
  faq: mockData.faqData,
  cta: mockData.ctaData,
  pricing: mockData.pricingData,
  company: mockData.companyData,
  settings: mockData.settingsData,
};
---

<Layout title="Demo: Kura Theme | Landy" description="Landy Kura theme demo">
  <ThemeKuraStorePage client:only="react" pageData={pageData} initialLanguage="ja" basePath="/demo/kura" />
</Layout>
`;
if (!fs.existsSync('src/pages/demo')) fs.mkdirSync('src/pages/demo', { recursive: true });
fs.writeFileSync('src/pages/demo/kura.astro', astroCode);

// 8. Update index.astro routing
let indexAstro = fs.readFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', 'utf8');
if (!indexAstro.includes('import ThemeKuraStorePage')) {
  indexAstro = indexAstro.replace(
    "import ThemeWarmStorePage from '../../../../../components/ThemeWarmStorePage';",
    "import ThemeWarmStorePage from '../../../../../components/ThemeWarmStorePage';\nimport ThemeKuraStorePage from '../../../../../components/ThemeKuraStorePage';"
  );
  indexAstro = indexAstro.replace(
    "} else if (theme === 'warm') {",
    "} else if (theme === 'kura') {\n    return <ThemeKuraStorePage client:only=\"react\" pageData={pageData} initialLanguage={lang} basePath={basePath} />;\n  } else if (theme === 'warm') {"
  );
  fs.writeFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', indexAstro);
}

console.log('Kura theme scaffolded successfully.');
