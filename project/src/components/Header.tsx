import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Menu, X, Globe } from 'lucide-react';
import { useHeaderData } from '../contexts/PageDataContext';
import { useLanguage, languageNames, type Language } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  if (!headerData) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              className="flex items-center gap-2 cursor-pointer z-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Waves className={`w-8 h-8 ${scrolled || mobileMenuOpen ? 'text-teal-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'}`}>
                {getLocalizedValue(headerData.logo, 'text', language)}
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6">
              {headerData.navigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-base font-medium transition-colors whitespace-nowrap ${
                    scrolled
                      ? 'text-gray-700 hover:text-teal-600'
                      : 'text-white hover:text-teal-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {getLocalizedValue(item, 'label', language)}
                </motion.button>
              ))}

              <div className="relative">
                <motion.button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    scrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">{languageNames[language]}</span>
                </motion.button>

                <AnimatePresence>
                  {languageMenuOpen && (
                    <>
                      <motion.div
                        className="fixed inset-0 z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLanguageMenuOpen(false)}
                      />
                      <motion.div
                        className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-40 overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {(Object.keys(languageNames) as Language[]).map((lang) => (
                          <motion.button
                            key={lang}
                            onClick={() => {
                              setLanguage(lang);
                              setLanguageMenuOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                              language === lang
                                ? 'bg-teal-50 text-teal-600 font-bold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            whileHover={{ x: 4 }}
                          >
                            {languageNames[lang]}
                          </motion.button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <motion.button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className={`z-50 p-2 ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'}`}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-6 h-6" />
              </motion.button>

              <motion.button
                className={`z-50 p-2 ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              className="fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl z-40 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="px-4 py-6 space-y-1">
                {headerData.navigation.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getLocalizedValue(item, 'label', language)}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {languageMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLanguageMenuOpen(false)}
            />
            <motion.div
              className="fixed top-20 right-4 bg-white rounded-lg shadow-xl z-50 overflow-hidden md:hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setLanguageMenuOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-3 text-base transition-colors ${
                    language === lang
                      ? 'bg-teal-50 text-teal-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {languageNames[lang]}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
