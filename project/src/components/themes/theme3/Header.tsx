import React, { useState, useEffect, useRef } from 'react';
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
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
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
        setLangMenuOpen(false);
      }
    };
    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langMenuOpen]);

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
  const logoText = getLocalizedValue(headerData.logo, 'text', language);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          scrolled || mobileMenuOpen
            ? 'bg-stone-50 border-b border-stone-200/80 shadow-sm py-3'
            : 'bg-transparent py-7'
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="cursor-pointer min-w-0 shrink flex-1 mr-4"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`font-serif text-xl lg:text-2xl tracking-[0.15em] font-light transition-colors duration-500 truncate ${
                scrolled || mobileMenuOpen ? 'text-stone-800' : 'text-white'
              }`}
            >
              {logoText}
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-wrap items-center justify-end gap-x-4 gap-y-2 max-w-full">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-serif text-[13px] tracking-[0.1em] transition-colors duration-300 whitespace-nowrap ${
                  scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {getLocalizedValue(item, 'label', language)}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Language Switcher — 言語コードのみ表示で省スペース */}
            <div className={`relative flex items-center gap-1 ${scrolled || mobileMenuOpen ? 'text-stone-500' : 'text-white/70'}`} ref={langMenuRef}>
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => window.location.href = `${basePath}${e.target.value === 'ja' ? '' : e.target.value + '/'}`}
                className="bg-transparent font-serif focus:outline-none cursor-pointer text-xs w-[3.5rem] max-w-[3.5rem]"
                style={{ direction: 'ltr' }}
              >
                <option value="ja" className="bg-stone-50 text-stone-800">JA</option>
                <option value="en" className="bg-stone-50 text-stone-800">EN</option>
                <option value="zh-tw" className="bg-stone-50 text-stone-800">繁中</option>
                <option value="ko" className="bg-stone-50 text-stone-800">KO</option>
              </select>
            </div>

            {/* Mobile Hamburger Toggle — lg未満で必ず表示 */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors shrink-0 ${
                scrolled || mobileMenuOpen ? 'text-stone-800 hover:bg-stone-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-stone-50 z-[110] flex flex-col pt-20 lg:hidden"
          >
            {/* 閉じるボタン — メニュー内右上 */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-6 p-2 text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="w-7 h-7" />
            </button>
            <nav className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="font-serif text-2xl tracking-widest text-stone-700 text-left py-4 border-b border-stone-100 hover:text-stone-900 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  {getLocalizedValue(item, 'label', language)}
                </motion.button>
              ))}
            </nav>

            {/* Language options at bottom */}
            <div className="px-8 py-6 border-t border-stone-200">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">言語 / Language</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <a
                    key={lang}
                    href={`${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                    className={`px-4 py-3 rounded-xl font-serif text-center text-sm transition-colors ${
                      language === lang
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
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
