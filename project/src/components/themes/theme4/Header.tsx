import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Menu, X, Globe } from 'lucide-react';
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

  // ✅ フックはearly returnより前に全て定義（Reactのルール）
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

  // 言語メニュー外クリックで閉じる
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

  // early return はフックの後
  if (!headerData) return null;

  const visibleSectionIds = new Set<string>([
    ...(pageData.about    ? ['about']    : []),
    ...(pageData.menu     ? ['menu']     : []),
    ...(pageData.pricing  ? ['pricing']  : []),
    ...(pageData.gallery  ? ['gallery']  : []),
    ...(pageData.staff    ? ['staff']    : []),
    ...(pageData.reviews  ? ['reviews']  : []),
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? 'bg-yellow-400 shadow-lg py-2'
            : 'bg-white/80 backdrop-blur-sm py-3 border-b border-red-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* 1行レイアウト: ロゴ | デスクトップNav | 言語ボタン | ハンバーガー */}
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer shrink-0 min-w-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-1.5 bg-red-600 rounded-lg shadow-lg shrink-0">
                <Sun className="w-5 h-5 text-yellow-400" />
              </div>
              <span className={`text-sm sm:text-lg font-black uppercase tracking-tighter break-words leading-tight ${
                scrolled || mobileMenuOpen ? 'text-red-700' : 'text-red-600'
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
            <nav className="hidden xl:flex items-center gap-4 flex-1 justify-end mr-4">
              {navigation.map((item) => {
                let label = getLocalizedValue(item, 'label', language);
                if (typeof label === 'object') {
                  label = (label as any)[language] || (label as any)['ja'] || '';
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-xs font-bold uppercase tracking-wider transition-all relative group whitespace-nowrap ${
                      scrolled ? 'text-red-900' : 'text-red-700'
                    }`}
                  >
                    {String(label)}
                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-red-600 transition-all group-hover:w-full rounded-full" />
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
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border-2 transition-all ${
                    scrolled || mobileMenuOpen
                      ? 'border-red-900/20 text-red-900 hover:bg-red-600 hover:text-white'
                      : 'border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-black">{language.toUpperCase()}</span>
                </button>

                <AnimatePresence>
                  {languageMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl overflow-hidden border border-red-50 z-[120]"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <a
                          key={lang}
                          href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                          className={`block px-5 py-3 text-sm font-bold transition-colors ${
                            language === lang
                              ? 'bg-red-600 text-white'
                              : 'text-red-800 hover:bg-red-50'
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
                className={`xl:hidden p-2 rounded-lg transition-colors ${
                  scrolled || mobileMenuOpen
                    ? 'text-red-900 hover:bg-red-600/20'
                    : 'text-red-600 bg-red-50 hover:bg-red-100'
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

      {/* Mobile Menu — Full Screen Slide */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-yellow-400 z-[110] flex flex-col pt-20 xl:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* 閉じるボタン — メニュー内右上 */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-red-900 hover:bg-red-600/20 rounded-lg transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="w-7 h-7" />
            </button>

            <nav className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-3xl font-black text-rose-900 text-left py-3 border-b border-rose-900/10 uppercase hover:text-rose-700 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  {String(getLocalizedValue(item, 'label', language))}
                </motion.button>
              ))}
            </nav>

            <div className="px-8 py-6 border-t border-rose-900/10">
              <p className="text-xs font-bold text-rose-900/50 uppercase tracking-widest mb-3">言語 / Language</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <a
                    key={lang}
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-2 rounded-full font-bold border-2 text-sm ${
                      language === lang
                        ? 'bg-rose-900 text-white border-rose-900'
                        : 'text-rose-900 border-rose-900/30 hover:border-rose-900'
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
