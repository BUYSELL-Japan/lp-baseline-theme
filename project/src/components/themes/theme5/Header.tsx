import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useHeaderData, usePageData } from '../../../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const pageData = usePageData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const langBtnRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };
    if (languageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

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

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-gray-950 border-b border-[#D4AF37]/30 py-2'
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between min-h-[3.5rem] py-1">

            {/* Logo - Cymbal-inspired gold circle + text */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer shrink min-w-0 max-w-[55%] xl:max-w-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.02 }}
            >
              {/* Cymbal disc decorative element */}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                scrolled || mobileMenuOpen
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-gray-800 bg-transparent'
              }`}>
                <div className={`w-3 h-3 rounded-full transition-colors ${
                  scrolled || mobileMenuOpen ? 'bg-[#D4AF37]' : 'bg-gray-800'
                }`} />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] line-clamp-2 leading-tight transition-colors ${
                scrolled || mobileMenuOpen ? 'text-white' : 'text-gray-900'
              }`}>
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
            <nav className="hidden xl:flex items-center gap-6 flex-1 justify-end mr-6">
              {navigation.map((item) => {
                let label = getLocalizedValue(item, 'label', language);
                if (typeof label === 'object') {
                  label = (label as any)[language] || (label as any)['ja'] || '';
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all relative group whitespace-nowrap ${
                      scrolled ? 'text-gray-300 hover:text-[#D4AF37]' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {String(label)}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] transition-all group-hover:w-full" />
                  </button>
                );
              })}
            </nav>

            {/* Right: Language + Hamburger */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Language Switcher */}
              <div className="relative" ref={langBtnRef}>
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all text-[10px] font-bold uppercase tracking-wider ${
                    scrolled || mobileMenuOpen
                      ? 'border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                      : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language.toUpperCase()}</span>
                </button>

                <AnimatePresence>
                  {languageMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-1 w-40 bg-gray-950 border border-gray-700 overflow-hidden z-[120]"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                    >
                      {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <a
                          key={lang}
                          href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                          className={`block px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b border-gray-800 last:border-0 ${
                            language === lang
                              ? 'bg-[#D4AF37] text-gray-950'
                              : 'text-gray-400 hover:text-[#D4AF37] hover:bg-gray-800'
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

              {/* Mobile Hamburger */}
              <button
                className={`xl:hidden p-2 transition-colors ${
                  scrolled || mobileMenuOpen
                    ? 'text-gray-300 hover:text-[#D4AF37]'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu — Industrial Dark Slide */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-950 z-[110] flex flex-col pt-20 xl:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            {/* Top gold accent bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-0">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-2xl font-bold text-gray-300 text-left py-5 border-b border-gray-800 uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                >
                  {String(getLocalizedValue(item, 'label', language))}
                </motion.button>
              ))}
            </nav>

            <div className="px-8 py-6 border-t border-gray-800">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">Language</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <a
                    key={lang}
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-colors ${
                      language === lang
                        ? 'bg-[#D4AF37] text-gray-950 border-[#D4AF37]'
                        : 'text-gray-400 border-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]'
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
