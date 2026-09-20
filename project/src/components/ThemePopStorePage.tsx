import React, { useEffect, useState } from 'react';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

import Header from './themes/pop/Header';
import Hero from './themes/pop/Hero';
import About from './themes/pop/About';
import Menu from './themes/pop/Menu';
import StoreInfo from './themes/pop/StoreInfo';
import Contact from './themes/pop/Contact';
import Footer from './themes/pop/Footer';
import Gallery from './themes/pop/Gallery';
import Staff from './themes/pop/Staff';
import News from './themes/pop/News';
import Access from './themes/pop/Access';
import FAQ from './themes/pop/FAQ';
import CTA from './themes/pop/CTA';
import Pricing from './themes/pop/Pricing';
import Company from './themes/pop/Company';

interface ThemePopStorePageProps {
  pageData: PageData;
  initialLanguage?: any;
  basePath?: string;
}

export default function ThemePopStorePage({ pageData, initialLanguage = 'ja', basePath }: ThemePopStorePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFFFFF]" />;
  }

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700;900&display=swap');
    :root {
      --font-sans: 'Noto Sans JP', sans-serif;
    }
    .font-sans {
      font-family: var(--font-sans);
    }
    body {
      background-color: #FFFFFF;
      color: #1a1a1a;
      overflow-x: hidden;
    }
  `;

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageDataProvider data={pageData}>
        <style>{fonts}</style>
        <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-[#FF006E] selection:text-white">
          {pageData.header && <Header />}
          <main>
            {pageData.hero && <Hero />}
            {pageData.menu && <Menu />}
            {pageData.about && <About />}
            {pageData.gallery && <Gallery />}
            {pageData.pricing && <Pricing />}
            {pageData.staff && <Staff />}
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
