import React, { useState, useEffect } from 'react';
import { useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';

export default function Header() {
  const headerData = useHeaderData();
  const { language, basePath } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (!headerData) return null;

  const logoText = headerData.logo?.text || '';
  const navItems = (headerData.navigation || []).filter(item => item.id !== 'reviews');

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{ backgroundColor: scrolled ? 'rgba(17,17,17,0.95)' : 'rgba(17,17,17,0.6)', borderBottom: scrolled ? '1px solid #D4541A' : '1px solid transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-[#FFFFFF] font-bold text-sm tracking-[0.2em] uppercase font-sans" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}>
          {logoText}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[#BBBBBB] hover:text-[#D4541A] text-xs tracking-[0.2em] uppercase transition-colors duration-300 font-sans"
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center space-x-3 ml-4 border-l border-[#333333] pl-4">
            {(['ja', 'en', 'zh-tw', 'ko'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => window.location.href = `${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                className="text-xs tracking-widest transition-colors duration-200 font-sans"
                style={{ color: language === lang ? '#D4541A' : '#666666' }}
              >
                {lang === 'ja' ? 'JP' : lang === 'en' ? 'EN' : lang === 'zh-tw' ? 'TW' : 'KO'}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col space-y-1.5 p-2"
          aria-label={menuOpen ? translate('mobileMenuClose', language) : translate('mobileMenuOpen', language)}
        >
          <span className="block w-6 h-px transition-all duration-300" style={{ backgroundColor: menuOpen ? '#D4541A' : '#BBBBBB' }}></span>
          <span className="block w-6 h-px transition-all duration-300" style={{ backgroundColor: menuOpen ? '#D4541A' : '#BBBBBB' }}></span>
          <span className="block w-6 h-px transition-all duration-300" style={{ backgroundColor: menuOpen ? '#D4541A' : '#BBBBBB' }}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 border-t border-[#D4541A]/30 max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ backgroundColor: '#111111' }}>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="text-[#BBBBBB] hover:text-[#D4541A] text-xs tracking-[0.2em] uppercase transition-colors font-sans"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-[#333333]">
            {(['ja', 'en', 'zh-tw', 'ko'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => window.location.href = `${basePath}${lang === 'ja' ? '' : lang + '/'}`}
                className="text-xs tracking-widest transition-colors font-sans"
                style={{ color: language === lang ? '#D4541A' : '#666666' }}
              >
                {lang === 'ja' ? 'JP' : lang === 'en' ? 'EN' : lang === 'zh-tw' ? 'TW' : 'KO'}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
