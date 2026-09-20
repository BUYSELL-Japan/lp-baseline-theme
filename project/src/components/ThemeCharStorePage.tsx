import React, { useEffect, useState } from 'react';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

import Header from './themes/char/Header';
import Hero from './themes/char/Hero';
import About from './themes/char/About';
import Menu from './themes/char/Menu';
import Gallery from './themes/char/Gallery';
import StoreInfo from './themes/char/StoreInfo';
import Contact from './themes/char/Contact';
import Footer from './themes/char/Footer';
import Staff from './themes/char/Staff';
import News from './themes/char/News';
import Access from './themes/char/Access';
import FAQ from './themes/char/FAQ';
import CTA from './themes/char/CTA';
import Pricing from './themes/char/Pricing';
import Company from './themes/char/Company';

interface ThemeCharStorePageProps {
  pageData: PageData;
  initialLanguage?: string;
  basePath?: string;
}

export default function ThemeCharStorePage({ pageData, initialLanguage = 'ja', basePath }: ThemeCharStorePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" style={{ backgroundColor: '#111111' }} />;
  }

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
    :root {
      --font-sans: 'Noto Sans JP', sans-serif;
    }
    body {
      background-color: #111111;
      color: #BBBBBB;
    }
  `;

  return (
    <LanguageProvider initialLanguage={initialLanguage as any}>
      <PageDataProvider data={pageData}>
        <style>{fonts}</style>
        <div className="min-h-screen" style={{ backgroundColor: '#111111', color: '#BBBBBB' }}>
          {pageData.header && <Header />}
          <main>
            {pageData.hero && <Hero />}
            {pageData.about && <About />}
            {pageData.menu && <Menu />}
            {pageData.pricing && <Pricing />}
            {pageData.staff && <Staff />}
            {pageData.gallery && <Gallery />}
            {pageData.company && <Company />}
            {pageData.storeInfo && <StoreInfo />}
            {pageData.access && <Access />}
            {pageData.faq && <FAQ />}
            {pageData.news && <News />}
            {pageData.contact && <Contact />}
            {pageData.cta && <CTA />}
          </main>
          {pageData.footer && <Footer />}
        </div>
      </PageDataProvider>
    </LanguageProvider>
  );
}
