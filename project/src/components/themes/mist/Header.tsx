import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageData, useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import type { Language } from '../../../contexts/LanguageContext';
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
  const basePath = typeof window !== 'undefined' ? window.location.pathname.replace(new RegExp(`/?${language}/?$`), '') : '';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        scrolled 
          ? 'py-4 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EEEEEE]' 
          : 'py-8 bg-transparent'
      }`}
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
              onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : '/' + e.target.value}`}
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
                  onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : '/' + e.target.value}`}
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
