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
          ? 'py-3 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer group min-w-0 shrink flex-1 mr-4"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            <BarChart3 className="text-white w-6 h-6 rotate-12" />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white truncate">
            {logoText}
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-4 gap-y-2 max-w-full">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              {getLocalizedValue(item, 'label', language)}
            </button>
          ))}
        </nav>

        {/* Language Switcher — always visible */}
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

        {/* Mobile Toggle */}
        <button 
          className="xl:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 bg-slate-950 z-[110] flex flex-col pt-20 xl:hidden"
          >
            {/* 閉じるボタン — メニュー内右上 */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-4 text-2xl font-black tracking-tighter text-white hover:text-blue-400 transition-colors border-b border-slate-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  {getLocalizedValue(item, 'label', language)}
                </motion.button>
              ))}
            </div>
            
            <div className="px-8 py-6 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">言語 / Language</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(languageNames).map(lang => (
                  <a 
                    key={lang} 
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-3 rounded-xl font-bold text-center text-sm transition-colors ${language === lang ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
