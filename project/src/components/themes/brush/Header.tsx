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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'py-3 bg-[#F5F0E8]/95 backdrop-blur-xl shadow-lg border-b border-[#1a1a1a]/10' 
          : 'py-6 bg-[#F5F0E8]/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
          className="flex items-center gap-2 cursor-pointer group min-w-0 shrink max-w-[80%] xl:max-w-none mr-4"
        >
          {headerData.logo.image && (
            <div className="w-10 h-10 shrink-0 bg-[#1a1a1a] rounded-sm flex items-center justify-center group-hover:bg-[#C0392B] transition-colors">
              <img
                src={headerData.logo.image}
                alt={logoText || 'Logo'}
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
            </div>
          )}
          <div className="text-sm sm:text-lg md:text-2xl font-serif font-black tracking-widest text-[#1a1a1a] break-words">
            {logoText}
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-6 gap-y-2 max-w-full">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-serif font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-[#C0392B] transition-colors whitespace-nowrap"
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 text-[#1a1a1a] ml-auto xl:ml-0">
          <select 
            value={language}
            onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : e.target.value + '/'}`}
            className="bg-transparent text-sm font-serif font-bold uppercase tracking-tight focus:outline-none cursor-pointer hover:text-[#C0392B]"
          >
            {Object.keys(languageNames).map(lang => (
              <option key={lang} value={lang} className="bg-[#F5F0E8]">{languageNames[lang as Language]}</option>
            ))}
          </select>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="xl:hidden w-10 h-10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/10 rounded-sm transition-colors"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden fixed inset-0 z-[90] bg-[#F5F0E8] pt-24 pb-safe flex flex-col h-screen overflow-y-auto"
          >
            <div className="px-8 flex-grow flex flex-col justify-center">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-5 text-2xl font-serif font-black tracking-widest text-[#1a1a1a] hover:text-[#C0392B] transition-colors border-b border-[#1a1a1a]/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {getLocalizedValue(item, 'label', language)}
                </motion.button>
              ))}
            </div>
            
            <div className="px-8 py-8 border-t border-[#1a1a1a]/10 mt-auto">
              <p className="text-sm font-serif font-bold text-[#1a1a1a] uppercase tracking-widest mb-4">{translate('languageLabel', language)}</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(languageNames).map(lang => (
                  <a 
                    key={lang} 
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-3 rounded-sm font-serif font-bold tracking-wider text-center transition-colors ${language === lang ? 'bg-[#1a1a1a] text-white' : 'bg-transparent border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a]/10'}`}
                  >
                    {languageNames[lang as Language]}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
