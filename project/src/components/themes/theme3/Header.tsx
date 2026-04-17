import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!headerData) return null;

  const navigation = Array.isArray(headerData.navigation) ? headerData.navigation : [];
  const logoText = getLocalizedValue(headerData.logo, 'text', language);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        scrolled
          ? 'bg-stone-50/95 backdrop-blur-sm border-b border-stone-200/80 shadow-sm py-3'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
        {/* Logo — Centered-look with elegant serif */}
        <motion.div
          className="cursor-pointer shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className={`font-serif text-2xl tracking-[0.15em] font-light transition-colors duration-500 ${
              scrolled ? 'text-stone-800' : 'text-white'
            }`}
          >
            {logoText}
          </span>
        </motion.div>

        {/* Desktop Nav — Minimal, spaced, wrap enabled for multiple languages */}
        <nav className="hidden lg:flex flex-wrap items-center justify-end gap-x-6 xl:gap-x-10 gap-y-2 max-w-full">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-serif text-sm tracking-[0.1em] transition-colors duration-300 ${
                scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'
              }`}
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}

          <div className={`flex items-center gap-1 text-xs tracking-widest ${scrolled ? 'text-stone-400' : 'text-white/60'}`}>
            <Globe className="w-3.5 h-3.5" />
            <select
              value={language}
              onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : e.target.value + '/'}`}
              className="bg-transparent font-serif focus:outline-none cursor-pointer"
            >
              {Object.keys(languageNames).map(lang => (
                <option key={lang} value={lang} className="bg-stone-50 text-stone-800">
                  {languageNames[lang as Language]}
                </option>
              ))}
            </select>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden transition-colors ${scrolled ? 'text-stone-800' : 'text-white'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-stone-50 border-b border-stone-200 py-8 px-8 flex flex-col gap-5 shadow-lg lg:hidden"
          >

            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-serif text-lg tracking-widest text-stone-700 text-left hover:text-stone-900"
              >
                {getLocalizedValue(item, 'label', language)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
