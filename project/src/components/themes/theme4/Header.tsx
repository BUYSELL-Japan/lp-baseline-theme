import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Menu, X, Globe } from 'lucide-react';
import { useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  if (!headerData) return null;

  const navigation = Array.isArray(headerData.navigation) ? headerData.navigation : [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-yellow-400/90 backdrop-blur-md shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg shadow-orange-500/20">
                <Sun className="w-6 h-6 text-yellow-200" />
              </div>
              <span className={`text-xl md:text-2xl font-black uppercase tracking-tighter ${
                scrolled ? 'text-rose-900' : 'text-white drop-shadow-md'
              }`}>
                {(() => {
                  let logoText = getLocalizedValue(headerData.logo, 'text', language);
                  if (typeof logoText === 'object') {
                    logoText = logoText[language] || logoText['ja'] || '';
                  }
                  return String(logoText || '');
                })()}
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => {
                let label = getLocalizedValue(item, 'label', language);
                if (typeof label === 'object') {
                  label = label[language] || label['ja'] || '';
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-bold uppercase tracking-wider transition-all relative group ${
                      scrolled ? 'text-rose-800' : 'text-white'
                    }`}
                  >
                    {String(label)}
                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-red-500 transition-all group-hover:w-full rounded-full" />
                  </button>
                );
              })}

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center gap-2 p-2 rounded-full border-2 transition-all ${
                    scrolled 
                      ? 'border-rose-900/10 text-rose-900 hover:bg-rose-900 hover:text-white' 
                      : 'border-white/20 text-white hover:bg-white hover:text-yellow-500'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-black">{language.toUpperCase()}</span>
                </button>

                <AnimatePresence>
                  {languageMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-3 w-40 bg-white rounded-2xl shadow-2xl overflow-hidden border border-yellow-100"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                      {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <a
                          key={lang}
                          href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                          className={`block px-5 py-3 text-sm font-bold transition-colors ${
                            language === lang
                              ? 'bg-yellow-400 text-rose-900'
                              : 'text-rose-800 hover:bg-orange-50'
                          }`}
                        >
                          {languageNames[lang]}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl ${scrolled ? 'text-rose-900 bg-yellow-400' : 'text-white bg-white/10'}`}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 top-[60px] bg-yellow-400 z-40 p-8 flex flex-col gap-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-4xl font-black text-rose-900 text-left uppercase"
                >
                  {String(getLocalizedValue(item, 'label', language))}
                </button>
              ))}
              <div className="mt-auto flex flex-wrap gap-3">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <a
                    key={lang}
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-2 rounded-full font-bold border-2 ${
                      language === lang ? 'bg-rose-900 text-white border-rose-900' : 'text-rose-900 border-rose-900/20'
                    }`}
                  >
                    {languageNames[lang]}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
