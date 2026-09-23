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

  // モバイルメニューが開いているとき body のスクロールを無効化
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
          ? 'py-3 bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#FFBE0B]/20 shadow-2xl' 
          : 'py-6 bg-[#FFFFFF]/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer group min-w-0 shrink max-w-[75%] xl:max-w-none mr-4"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 shrink-0 bg-[#7B2FBE] rounded-xl flex items-center justify-center shadow-lg shadow-[#1a1a1a]/30 group-hover:bg-[#7B2FBE] transition-colors">
            
          </div>
          <div className="text-sm sm:text-xl font-sans font-black tracking-tight text-[#2D2D2D] break-words leading-tight">
            {logoText}
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-4 gap-y-2 max-w-full">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-xs font-sans font-black tracking-tight uppercase tracking-widest text-amber-900/80 hover:text-[#FB5607] transition-colors whitespace-nowrap"
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}
        </nav>

        {/* Language Switcher — always visible */}
        <div className="flex items-center gap-2 text-amber-900/80">
          
          <select 
            value={language}
            onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : e.target.value + '/'}`}
            className="bg-transparent text-xs font-sans font-black tracking-tight uppercase tracking-tight focus:outline-none cursor-pointer hover:text-[#2D2D2D]"
          >
            {Object.keys(languageNames).map(lang => (
              <option key={lang} value={lang} className="bg-[#FFFFFF]">{languageNames[lang as Language]}</option>
            ))}
          </select>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="xl:hidden w-10 h-10 flex items-center justify-center text-[#2D2D2D] hover:bg-[#7B2FBE]/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? translate('mobileMenuClose', language) : translate('mobileMenuOpen', language)}
        >
          {mobileMenuOpen ? translate('mobileMenuClose', language) : translate('mobileMenuOpen', language)}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#FFFFFF] z-[110] flex flex-col pt-20 xl:hidden"
          >
            {/* 閉じるボタン — メニュー内右上 */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#2D2D2D] hover:bg-[#7B2FBE]/10 rounded-lg transition-colors"
              aria-label={translate('mobileMenuClose', language)}
            >
              {translate('mobileMenuClose', language)}
            </button>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-4 text-2xl font-sans font-black tracking-tight text-[#2D2D2D] hover:text-[#FB5607] transition-colors border-b border-[#FFBE0B]/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  {getLocalizedValue(item, 'label', language)}
                </motion.button>
              ))}
            </div>
            
            <div className="px-8 py-6 border-t border-[#FFBE0B]/20">
              <p className="text-xs font-sans font-black tracking-tight text-[#2D2D2D] uppercase tracking-widest mb-3">{translate('languageLabel', language)}</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(languageNames).map(lang => (
                  <a 
                    key={lang} 
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-3 rounded-xl font-sans font-black tracking-tight text-center text-sm transition-colors ${language === lang ? 'bg-[#7B2FBE] text-white' : 'bg-[#F5F0E8] text-[#1a1a1a] hover:bg-[#FFFFFF]'}`}
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
