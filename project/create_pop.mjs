import fs from 'fs';
import path from 'path';

const SRC_DIR = 'src/components/themes/kura'; // Using Kura or Warm as base
const DEST_DIR = 'src/components/themes/pop';

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// 1. Copy basic sections
const filesToCopy = [
  'Access.tsx', 'Company.tsx', 'Contact.tsx', 'CTA.tsx', 
  'FAQ.tsx', 'Footer.tsx', 'Header.tsx', 'News.tsx', 
  'Pricing.tsx', 'Staff.tsx', 'StoreInfo.tsx'
];

for (const file of filesToCopy) {
  const srcPath = path.join(SRC_DIR, file);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Replace fonts: we want font-black (900) for headings and font-bold (700) for body
    content = content.replace(/font-serif tracking-widest/g, 'font-sans font-black tracking-tight');
    content = content.replace(/font-serif tracking-wider/g, 'font-sans font-black tracking-tight');
    content = content.replace(/font-sans font-light/g, 'font-sans font-bold');
    
    // Colors (make them pop)
    // We will just do a general replacement for buttons/accents
    content = content.replace(/bg-\[#1a1a1a\]/g, 'bg-[#7B2FBE]'); // Sumi -> Purple
    content = content.replace(/bg-\[#C0392B\]/g, 'bg-[#FF006E]'); // Shu -> Pink
    content = content.replace(/text-\[#C0392B\]/g, 'text-[#FB5607]'); // Shu -> Orange
    content = content.replace(/border-\[#C0392B\]/g, 'border-[#FFBE0B]'); // Shu -> Yellow
    
    // Padding (narrower)
    content = content.replace(/py-32 md:py-48/g, 'py-16 md:py-24');
    
    fs.writeFileSync(path.join(DEST_DIR, file), content);
  }
}

// 2. Custom Hero
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
  const storeName = storeInfo ? getLocalizedValue(storeInfo, 'name', language) : '';

  const bounceVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
        bounce: 0.6,
      }
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-[90vh] md:min-h-screen bg-gradient-to-br from-[#FF006E] to-[#FB5607] flex flex-col justify-center items-center overflow-hidden">
      
      {/* Optional faint background image blending */}
      {heroData.backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img 
            src={heroData.backgroundImage} 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="relative z-10 px-6 text-center w-full flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="flex flex-col items-center gap-6"
        >
          {storeName && (
            <motion.h1 
              variants={bounceVariants}
              className="text-6xl md:text-8xl lg:text-9xl font-sans font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] mb-4"
            >
              {storeName}
            </motion.h1>
          )}
          
          <motion.div variants={bounceVariants} className="bg-white text-[#1a1a1a] px-8 py-4 rounded-full rotate-2 shadow-2xl mb-6">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-black tracking-tight">
              {title}
            </h2>
          </motion.div>
          
          {subtitle && (
            <motion.p variants={bounceVariants} className="text-xl md:text-3xl font-sans font-bold text-white drop-shadow-md">
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* SVG Wave Divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,113.88,192.5,93.4,242.69,76.75,286.9,62.83,321.39,56.44Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'Hero.tsx'), heroCode);

// 3. Custom Menu
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

  if (!menuData.items || menuData.items.length === 0) {
    return <SectionError sectionName="Menu" error="No menu items found." data={menuData} />;
  }

  // Pre-generate pseudo-random rotations so they don't mismatch on hydration
  const rotations = [2, -3, 1, -2, 3, -1, 4, -4];

  return (
    <section id="menu" className="relative py-24 md:py-32 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-[#1a1a1a] tracking-tight">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {menuData.items.map((item, index) => {
            const itemName = getLocalizedValue(item, 'name', language);
            const rot = rotations[index % rotations.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05, rotate: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{ rotate: \`\${rot}deg\` }}
                className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-[#1a1a1a] flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="w-full h-[250px] relative overflow-hidden bg-[#FFBE0B]/20">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={itemName} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                  {/* Price Sticker */}
                  <div className="absolute bottom-4 right-4 bg-[#FF006E] text-white font-black text-2xl px-4 py-2 rounded-xl rotate-[-5deg] shadow-lg border-2 border-white">
                    {item.price}
                  </div>
                </div>
                
                {/* Text */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black text-[#1a1a1a] mb-3 leading-tight">
                    {itemName}
                  </h3>
                  {item.description && (
                    <p className="text-base text-[#1a1a1a]/80 font-bold leading-relaxed">
                      {getLocalizedValue(item, 'description', language)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SVG Zigzag Divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-full z-20">
        <svg className="relative block w-full h-[30px]" viewBox="0 0 1200 30" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L600,30 L1200,0 L1200,30 L0,30 Z" fill="#FFBE0B"></path>
        </svg>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'Menu.tsx'), menuCode);

// 4. Custom About
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

  if (!aboutData.features || aboutData.features.length === 0) {
    return <SectionError sectionName="About" error="Missing about features data" data={aboutData} />;
  }

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#FFBE0B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-block bg-[#1a1a1a] text-white px-8 py-3 rounded-full rotate-[-2deg] mb-4"
          >
            <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tight">
              {sectionTitle}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutData.features.map((feature, index) => {
            const title = getLocalizedValue(feature, 'title', language);
            const desc = getLocalizedValue(feature, 'description', language);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[#FFFFFF] border-4 border-[#1a1a1a] rounded-[24px] p-6 shadow-[8px_8px_0_0_#1a1a1a] flex flex-col h-full"
              >
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border-2 border-[#1a1a1a]">
                  {feature.image ? (
                    <img 
                      src={feature.image} 
                      alt={title || ''} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#8ECAE6]"></div>
                  )}
                </div>

                <div className="flex-grow">
                  {title && (
                    <h3 className="text-2xl font-black text-[#1a1a1a] mb-4 leading-tight">
                      {title}
                    </h3>
                  )}
                  {desc && (
                    <div className="text-[#1a1a1a] font-bold text-base space-y-4">
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
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,113.88,192.5,93.4,242.69,76.75,286.9,62.83,321.39,56.44Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(path.join(DEST_DIR, 'About.tsx'), aboutCode);

// 5. Custom Gallery
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

  const overlayColors = ['bg-[#FF006E]', 'bg-[#FB5607]', 'bg-[#FFBE0B]', 'bg-[#8ECAE6]', 'bg-[#7B2FBE]'];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-[#1a1a1a] tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        
        {/* PC: 3-column, Mobile: 2-column square grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {galleryData.images.map((img, index) => {
            const caption = getLocalizedValue(img, 'caption', language);
            const overlayColor = overlayColors[index % overlayColors.length];
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md"
              >
                <img 
                  src={img.url} 
                  alt={caption || ''} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Vivid Color Overlay */}
                <div className={\`absolute inset-0 \${overlayColor}/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4\`}>
                  {caption && (
                    <h3 className="text-white font-black text-center text-lg md:text-2xl drop-shadow-md">
                      {caption}
                    </h3>
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
fs.writeFileSync(path.join(DEST_DIR, 'Gallery.tsx'), galleryCode);

// 6. Create ThemePopStorePage.tsx
const pageCode = `import React, { useEffect, useState } from 'react';
import type { PageData } from '../../services/dataMapper';
import { PageDataProvider } from '../../contexts/PageDataContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

import Header from './themes/pop/Header';
import Hero from './themes/pop/Hero';
import About from './themes/pop/About';
import Menu from './themes/pop/Menu';
import StoreInfo from './themes/pop/StoreInfo';
import Contact from './themes/pop/Contact';
import Footer from './themes/pop/Footer';
import Gallery from './themes/pop/Gallery';
import Staff from './themes/pop/Staff';
import News from './themes/pop/News';
import Access from './themes/pop/Access';
import FAQ from './themes/pop/FAQ';
import CTA from './themes/pop/CTA';
import Pricing from './themes/pop/Pricing';
import Company from './themes/pop/Company';

interface ThemePopStorePageProps {
  pageData: PageData;
  initialLanguage?: any;
  basePath?: string;
}

export default function ThemePopStorePage({ pageData, initialLanguage = 'ja', basePath }: ThemePopStorePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFFFFF]" />;
  }

  const fonts = \`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700;900&display=swap');
    :root {
      --font-sans: 'Noto Sans JP', sans-serif;
    }
    .font-sans {
      font-family: var(--font-sans);
    }
    body {
      background-color: #FFFFFF;
      color: #1a1a1a;
      overflow-x: hidden;
    }
  \`;

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageDataProvider data={pageData}>
        <style>{fonts}</style>
        <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-[#FF006E] selection:text-white">
          {pageData.header && <Header />}
          <main>
            {pageData.hero && <Hero />}
            {pageData.menu && <Menu />}
            {pageData.about && <About />}
            {pageData.gallery && <Gallery />}
            {pageData.pricing && <Pricing />}
            {pageData.staff && <Staff />}
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
fs.writeFileSync('src/components/ThemePopStorePage.tsx', pageCode);

// 7. Create demo/pop.astro
const astroCode = `---
import Layout from '../../layouts/Layout.astro';
import ThemePopStorePage from '../../components/ThemePopStorePage';
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
  news: mockData.newsData,
  access: mockData.accessData,
  faq: mockData.faqData,
  cta: mockData.ctaData,
  pricing: mockData.pricingData,
  company: mockData.companyData,
  settings: mockData.settingsData,
};
---

<Layout title="Demo: Pop Theme | Landy" description="Landy Pop theme demo">
  <ThemePopStorePage client:only="react" pageData={pageData} initialLanguage="ja" basePath="/demo/pop" />
</Layout>
`;
fs.writeFileSync('src/pages/demo/pop.astro', astroCode);

// 8. Update index.astro routing
let indexAstro = fs.readFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', 'utf8');
if (!indexAstro.includes('import ThemePopStorePage')) {
  indexAstro = indexAstro.replace(
    "import ThemeKuraStorePage from '../../../../../components/ThemeKuraStorePage';",
    "import ThemeKuraStorePage from '../../../../../components/ThemeKuraStorePage';\nimport ThemePopStorePage from '../../../../../components/ThemePopStorePage';"
  );
  indexAstro = indexAstro.replace(
    "} else if (theme === 'kura') {",
    "} else if (theme === 'pop') {\n    return <ThemePopStorePage client:only=\"react\" pageData={pageData} initialLanguage={lang as any} basePath={basePath} />;\n  } else if (theme === 'kura') {"
  );
  fs.writeFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', indexAstro);
}

console.log('Pop theme scaffolded successfully.');
