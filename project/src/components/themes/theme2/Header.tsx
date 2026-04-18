import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, BarChart3 } from 'lucide-react';
import { useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!headerData) return null;

  const navigation = Array.isArray(headerData.navigation) ? headerData.navigation : [];

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
          ? 'py-3 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            <BarChart3 className="text-white w-6 h-6 rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            {logoText}
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-wrap items-center justify-end gap-x-8 gap-y-2 max-w-full">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors"
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}
          
          <div className="h-4 w-px bg-slate-800" />
          
          <div className="flex items-center gap-2 text-slate-400">
            <Globe className="w-4 h-4" />
            <select 
              value={language}
              onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : e.target.value + '/'}`}
              className="bg-transparent text-xs font-bold uppercase tracking-tight focus:outline-none cursor-pointer hover:text-white"
            >
              {Object.keys(languageNames).map(lang => (
                <option key={lang} value={lang} className="bg-slate-900">{languageNames[lang as Language]}</option>
              ))}
            </select>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-12 h-12 flex items-center justify-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-slate-950 z-[90] flex flex-col p-8 pt-24 lg:hidden"
          >
            <div className="space-y-6">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-3xl font-black tracking-tighter text-white hover:text-blue-500 transition-colors"
                >
                  {getLocalizedValue(item, 'label', language)}
                </button>
              ))}
            </div>
            
            <div className="mt-auto pt-8 border-t border-slate-900 grid grid-cols-2 gap-4">
              {Object.keys(languageNames).map(lang => (
                <a 
                  key={lang} 
                  href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                  className={`px-4 py-3 rounded-xl font-bold text-center ${language === lang ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  {languageNames[lang as Language]}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
