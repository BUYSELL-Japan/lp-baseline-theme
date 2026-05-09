import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Menu, X, Globe } from 'lucide-react';
import { useHeaderData } from '../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // ✅ フックはearly returnより前に全て定義（Reactのルール）
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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

  // 言語メニューの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };
    if (languageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

  // early return はフックの後
  if (!headerData) return null;

  const navigation = Array.isArray(headerData.navigation) ? headerData.navigation : [];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-white shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer z-50 min-w-0 flex-1 pr-4 xl:flex-none xl:pr-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Waves className={`w-8 h-8 shrink-0 ${scrolled || mobileMenuOpen ? 'text-teal-600' : 'text-white'}`} />
              <span className={`text-xl md:text-2xl font-bold leading-tight truncate ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'}`}>
                {(() => {
                  let logoText = getLocalizedValue(headerData.logo, 'text', language);
                  if (typeof logoText === 'object') {
                    logoText = (logoText as any)[language] || (logoText as any)['ja'] || '';
                  }
                  return String(logoText || '');
                })()}
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex flex-wrap items-center justify-end gap-x-4 gap-y-2 flex-1 min-w-0">
              {navigation.map((item) => {
                let label = getLocalizedValue(item, 'label', language);
                if (typeof label === 'object') {
                  label = (label as any)[language] || (label as any)['ja'] || '';
                }
                label = String(label || '');
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors whitespace-nowrap ${
                      scrolled
                        ? 'text-gray-700 hover:text-teal-600'
                        : 'text-white hover:text-teal-300'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 ml-2">
              {/* Language Switcher — always visible, single dropdown */}
              <div className="relative" ref={langMenuRef}>
                <motion.button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    scrolled || mobileMenuOpen
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold">{language.toUpperCase()}</span>
                </motion.button>

                <AnimatePresence>
                  {languageMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl z-[60] overflow-hidden border border-gray-100"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <a
                          key={lang}
                          href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                          className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                            language === lang
                              ? 'bg-teal-50 text-teal-600 font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setLanguageMenuOpen(false)}
                        >
                          {languageNames[lang]}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Hamburger Toggle */}
              <motion.button
                className={`xl:hidden p-2 rounded-lg transition-colors ${
                  scrolled || mobileMenuOpen ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu — Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 xl:hidden flex flex-col pt-20"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
              {navigation.map((item, index) => {
                let label = getLocalizedValue(item, 'label', language);
                if (typeof label === 'object') {
                  label = (label as any)[language] || (label as any)['ja'] || '';
                }
                label = String(label || '');
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-4 text-xl font-bold text-gray-900 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Language options at bottom */}
            <div className="px-6 py-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">言語 / Language</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <a
                    key={lang}
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-3 rounded-xl font-bold text-center text-sm transition-colors ${
                      language === lang
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {languageNames[lang]}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
