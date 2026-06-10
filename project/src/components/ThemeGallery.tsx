import React, { useState, useEffect } from 'react';
import StorePage from './StorePage';
import Theme2StorePage from './Theme2StorePage';
import Theme3StorePage from './Theme3StorePage';
import Theme4StorePage from './Theme4StorePage';
import Theme5StorePage from './Theme5StorePage';
import type { PageData } from '../services/dataMapper';
import type { Language } from '../contexts/LanguageContext';

interface ThemeGalleryProps {
  pageData: PageData;
}

export default function ThemeGallery({ pageData }: ThemeGalleryProps) {
  const [theme, setTheme] = useState<'theme1' | 'theme2' | 'theme3' | 'theme4' | 'theme5'>('theme1');

  useEffect(() => {
    // Initial load
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam === 'theme2' || themeParam === 'theme3' || themeParam === 'theme4' || themeParam === 'theme5') {
      setTheme(themeParam);
    }

    // Handle back/forward navigation
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('theme');
      if (t === 'theme1' || t === 'theme2' || t === 'theme3' || t === 'theme4' || t === 'theme5') {
        setTheme(t as any);
      } else {
        setTheme('theme1');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const changeTheme = (newTheme: 'theme1' | 'theme2' | 'theme3' | 'theme4' | 'theme5') => {
    setTheme(newTheme);
    const url = new URL(window.location.href);
    url.searchParams.set('theme', newTheme);
    window.history.pushState({}, '', url.toString());
  };

  const lang: Language = 'ja';

  return (
    <div className="theme-gallery">
      <style dangerouslySetInnerHTML={{ __html: `
        .theme-switcher-ui {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .theme-switcher-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .theme-btn-group {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .theme-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #64748b;
        }
        .theme-btn:hover {
          color: #1e293b;
        }
        .theme-btn.active {
          background: #ffffff;
          color: #2563eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .theme-content-wrapper {
          padding-top: 60px;
        }
      `}} />

      <div className="theme-switcher-ui">
        <div className="theme-switcher-container">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mr-4">Select Template</span>
          <div className="theme-btn-group">
            <button 
              className={`theme-btn ${theme === 'theme1' ? 'active' : ''}`}
              onClick={() => changeTheme('theme1')}
            >
              Theme 1 (Standard)
            </button>
            <button 
              className={`theme-btn ${theme === 'theme2' ? 'active' : ''}`}
              onClick={() => changeTheme('theme2')}
            >
              Theme 2 (Modern)
            </button>
            <button 
              className={`theme-btn ${theme === 'theme3' ? 'active' : ''}`}
              onClick={() => changeTheme('theme3')}
            >
              Theme 3 (Elegant)
            </button>
            <button 
              className={`theme-btn ${theme === 'theme4' ? 'active' : ''}`}
              onClick={() => changeTheme('theme4')}
            >
              Theme 4 (Tropical)
            </button>
            <button 
              className={`theme-btn ${theme === 'theme5' ? 'active' : ''}`}
              onClick={() => changeTheme('theme5')}
            >
              Theme 5 (Urban)
            </button>
          </div>
        </div>
      </div>

      <div className="theme-content-wrapper">
        {theme === 'theme1' && <StorePage pageData={pageData} initialLanguage={lang} basePath="/preview" />}
        {theme === 'theme2' && <Theme2StorePage pageData={pageData} initialLanguage={lang} basePath="/preview" />}
        {theme === 'theme3' && <Theme3StorePage pageData={pageData} initialLanguage={lang} basePath="/preview" />}
        {theme === 'theme4' && <Theme4StorePage pageData={pageData} initialLanguage={lang} basePath="/preview" />}
        {theme === 'theme5' && <Theme5StorePage pageData={pageData} initialLanguage={lang} basePath="/preview" />}
      </div>
    </div>
  );
}
