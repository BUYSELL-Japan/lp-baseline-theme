import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useHeaderData, usePageData } from '../../../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const pageData = usePageData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/95 backdrop-blur-xl border-b border-[#E5E5E5] shadow-none' 
          : 'py-6 bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer group min-w-0 shrink max-w-[75%] xl:max-w-none mr-4"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
        >
          {headerData.logo.image && (
            <div className="w-10 h-10 shrink-0 bg-[#F8F8F8] border border-[#E5E5E5] rounded-none flex items-center justify-center">
              <img 
                src={headerData.logo.image} 
                alt={logoText || 'Logo'}
                className="w-6 h-6 object-contain filter grayscale" 
              />
            </div>
          )}
          <div className="text-sm sm:text-base md:text-xl font-sans font-bold text-[#333333] break-words">
            {logoText}
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-6 gap-y-2 max-w-full">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-sans font-bold text-[#333333] hover:text-[#2D6A4F] transition-colors whitespace-nowrap"
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 text-[#333333]">
          <select 
            value={language}
            onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : e.target.value + '/'}`}
            className="bg-transparent text-sm font-sans font-bold uppercase focus:outline-none cursor-pointer hover:text-[#2D6A4F]"
          >
            {Object.keys(languageNames).map(lang => (
              <option key={lang} value={lang} className="bg-white">{languageNames[lang as Language]}</option>
            ))}
          </select>
        </div>

        {/* Mobile Toggle */}
        <button
          className="xl:hidden w-10 h-10 flex items-center justify-center text-[#333333] hover:bg-[#F8F8F8] rounded-none transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? translate('mobileMenuClose', language) : translate('mobileMenuOpen', language)}
        >
          <div className="w-6 flex flex-col items-end gap-1.5">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white z-[110] flex flex-col pt-20 xl:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex flex-col items-center justify-center text-[#333333]"
              aria-label={translate('mobileMenuClose', language)}
            >
              <span className="block h-0.5 w-6 bg-current rotate-45 translate-y-0.5" />
              <span className="block h-0.5 w-6 bg-current -rotate-45 -translate-y-0.5" />
            </button>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-4 text-xl font-sans font-bold text-[#333333] hover:text-[#2D6A4F] transition-colors border-b border-[#F8F8F8]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {getLocalizedValue(item, 'label', language)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
