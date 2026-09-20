import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src', 'components', 'themes', 'mist');

const heroContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData, usePageData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Hero() {
  const heroData = useHeroData();
  const pageData = usePageData();
  const { language } = useLanguage();

  if (!heroData) return <SectionError sectionName="Hero" error="No hero data available" />;

  const title = getLocalizedValue(heroData, 'title', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);
  const showReservations = pageData.reservations !== false;

  return (
    <section id="hero" className="bg-[#FFFFFF] pt-40 pb-32 md:pt-56 md:pb-48 px-6 md:px-12 border-b border-[#EEEEEE] flex flex-col items-center justify-center text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-4xl md:text-5xl font-sans font-medium text-[#222222] mb-6 tracking-[0.15em] whitespace-pre-line"
      >
        {title}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-sm md:text-base font-sans font-light text-[#888888] tracking-[0.2em] mb-16 whitespace-pre-line leading-loose"
      >
        {subtitle}
      </motion.p>
      
      {showReservations && (
        <motion.a 
          href="#contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="inline-block border border-[#6B8F71] text-[#6B8F71] font-sans font-light px-12 py-3 hover:bg-[#6B8F71] hover:text-white transition-colors duration-500 text-sm tracking-[0.1em]"
        >
          {translate('bookingContact', language)}
        </motion.a>
      )}
    </section>
  );
}
`;

const menuContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();

  if (!menuData) return <SectionError sectionName="Menu" error="No menu data available" />;
  if (!menuData.items || menuData.items.length === 0) return <SectionError sectionName="Menu" error="No menu items found" />;

  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language);

  return (
    <section id="menu" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'メニュー'}
          </h2>
        </motion.div>

        <div className="w-full flex flex-col space-y-24">
          {menuData.items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center w-full"
            >
              {item.image ? (
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-8 border border-[#EEEEEE] shadow-sm">
                  <img src={item.image} alt="" className="w-full h-full object-cover grayscale-[20%]" />
                </div>
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-white mb-8 border border-[#EEEEEE]" />
              )}
              
              <h4 className="font-sans font-medium text-[#444444] text-base mb-3 tracking-[0.1em]">
                {getLocalizedValue(item, 'name', language)}
              </h4>
              
              {item.description && (
                <p className="text-[#888888] font-light text-sm mb-4 leading-relaxed max-w-md">
                  {getLocalizedValue(item, 'description', language)}
                </p>
              )}

              <span className="font-sans font-light text-sm text-[#6B8F71] tracking-widest">
                {getLocalizedValue(item, 'price', language)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const aboutContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();

  if (!aboutData) return <SectionError sectionName="About" error="No about data available" />;

  const sectionTitle = getLocalizedValue(aboutData, 'sectionTitle', language);
  const features = aboutData.features || [];

  return (
    <section id="about" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="flex flex-col space-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h3 className="text-lg md:text-xl font-sans font-medium text-[#222222] mb-8 tracking-[0.1em]">
                {getLocalizedValue(feature, 'title', language)}
              </h3>
              <p className="text-[#888888] font-light text-sm md:text-base leading-loose tracking-widest whitespace-pre-line">
                {getLocalizedValue(feature, 'description', language)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const galleryContent = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!galleryData) return <SectionError sectionName="Gallery" error="No gallery data available" />;
  if (!galleryData.images || galleryData.images.length === 0) return null;

  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language);

  return (
    <section id="gallery" className="bg-[#F5F5F3] py-32 md:py-48 px-4 md:px-0 border-b border-[#EEEEEE]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
          {sectionTitle || 'ギャラリー'}
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#FFFFFF] p-[1px]">
          {galleryData.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="aspect-square relative group overflow-hidden cursor-pointer bg-[#F5F5F3]"
              onClick={() => setSelectedImage(image.url)}
            >
              <img 
                src={image.url} 
                alt={getLocalizedValue(image, 'caption', language) || ''} 
                className="w-full h-full object-cover grayscale-[30%] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#F5F5F3]/0 group-hover:bg-[#F5F5F3]/30 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#FFFFFF]/95 backdrop-blur flex items-center justify-center p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-[#888888] hover:text-[#222222] text-2xl transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={selectedImage}
              alt="Gallery Preview"
              className="max-w-full max-h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
`;

const headerContent = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageData, useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import type { Language } from '../../../data/types';
import SectionError from '../../SectionError';

const languageNames: Record<Language, string> = {
  ja: 'JP',
  en: 'EN',
  'zh-tw': 'TW',
  ko: 'KR',
};

export default function Header() {
  const pageData = usePageData();
  const headerData = useHeaderData();
  const { language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!headerData) return null;

  const visibleSectionIds = new Set<string>([
    ...(pageData.about    ? ['about']    : []),
    ...(pageData.menu     ? ['menu']     : []),
    ...(pageData.pricing  ? ['pricing']  : []),
    ...(pageData.gallery  ? ['gallery']  : []),
    ...(pageData.staff    ? ['staff']    : []),
    ...(pageData.news     ? ['news']     : []),
    ...(pageData.storeInfo ? ['storeInfo'] : []),
    ...(pageData.company  ? ['company']  : []),
    ...(pageData.access   ? ['access']   : []),
    ...(pageData.faq      ? ['faq']      : []),
    ...(pageData.contact  ? ['contact']  : []),
  ]);

  const navigation = Array.isArray(headerData.navigation)
    ? headerData.navigation.filter((item) => visibleSectionIds.has(item.id))
    : [];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const logoText = getLocalizedValue(headerData.logo, 'text', language);
  const basePath = typeof window !== 'undefined' ? window.location.pathname.replace(new RegExp(\`/?\${language}/?$\`), '') : '';

  return (
    <header 
      className={\`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 \${
        scrolled 
          ? 'py-4 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EEEEEE]' 
          : 'py-8 bg-transparent'
      }\`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <motion.div 
          className="flex items-center cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {headerData.logo.image ? (
            <img 
              src={headerData.logo.image} 
              alt={logoText || 'Logo'} 
              className="h-6 md:h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <span className="text-base md:text-lg font-sans font-medium text-[#222222] tracking-[0.2em] group-hover:text-[#6B8F71] transition-colors duration-500">
              {logoText}
            </span>
          )}
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-10">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-xs font-sans font-light text-[#888888] hover:text-[#222222] transition-colors duration-500 tracking-[0.1em]"
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}
          
          {/* Language Switcher */}
          <div className="flex items-center text-[#888888]">
            <select 
              value={language}
              onChange={(e) => window.location.href = \`\${basePath}\${e.target.value === 'ja' ? '' : '/' + e.target.value}\`}
              className="bg-transparent text-xs font-sans font-light uppercase focus:outline-none cursor-pointer hover:text-[#222222] transition-colors duration-500"
            >
              {Object.keys(languageNames).map(lang => (
                <option key={lang} value={lang}>{languageNames[lang as Language]}</option>
              ))}
            </select>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="xl:hidden w-10 h-10 flex items-center justify-end text-[#888888] transition-colors duration-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="text-sm font-sans font-light tracking-widest">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-x-0 top-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EEEEEE] xl:hidden overflow-y-auto max-h-[calc(100vh-80px)]"
          >
            <nav className="flex flex-col py-12 px-8 space-y-8 items-center">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-sans font-light text-[#444444] tracking-[0.2em] hover:text-[#6B8F71] transition-colors duration-500"
                >
                  {getLocalizedValue(item, 'label', language)}
                </button>
              ))}
              
              <div className="pt-8 w-12 border-t border-[#EEEEEE] flex justify-center">
                <select 
                  value={language}
                  onChange={(e) => window.location.href = \`\${basePath}\${e.target.value === 'ja' ? '' : '/' + e.target.value}\`}
                  className="bg-transparent text-xs font-sans font-light uppercase text-[#888888] focus:outline-none"
                >
                  {Object.keys(languageNames).map(lang => (
                    <option key={lang} value={lang}>{languageNames[lang as Language]}</option>
                  ))}
                </select>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
`;

fs.writeFileSync(path.join(dir, 'Hero.tsx'), heroContent);
fs.writeFileSync(path.join(dir, 'Menu.tsx'), menuContent);
fs.writeFileSync(path.join(dir, 'About.tsx'), aboutContent);
fs.writeFileSync(path.join(dir, 'Gallery.tsx'), galleryContent);
fs.writeFileSync(path.join(dir, 'Header.tsx'), headerContent);

console.log('Wrote core Mist components');
