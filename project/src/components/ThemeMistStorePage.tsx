import React, { useEffect, useState } from 'react';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

import Header from './themes/mist/Header';
import Hero from './themes/mist/Hero';
import About from './themes/mist/About';
import Menu from './themes/mist/Menu';
import StoreInfo from './themes/mist/StoreInfo';
import Contact from './themes/mist/Contact';
import Footer from './themes/mist/Footer';
import Gallery from './themes/mist/Gallery';
import Staff from './themes/mist/Staff';
import News from './themes/mist/News';
import Access from './themes/mist/Access';
import FAQ from './themes/mist/FAQ';
import CTA from './themes/mist/CTA';
import Pricing from './themes/mist/Pricing';
import Company from './themes/mist/Company';

interface ThemeMistStorePageProps {
  pageData: PageData;
  initialLanguage?: string;
  basePath?: string;
}

export default function ThemeMistStorePage({ pageData, initialLanguage = 'ja', basePath }: ThemeMistStorePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFFFFF]" />;
  }

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap');
    :root {
      --font-sans: 'Noto Sans JP', sans-serif;
    }
    .font-sans {
      font-family: var(--font-sans);
    }
    body {
      background-color: #FFFFFF;
      color: #444444;
    }
  `;

  return (
    <LanguageProvider initialLanguage={initialLanguage as any}>
      <PageDataProvider data={pageData}>
        <style>{fonts}</style>
        <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-[#F5F5F3] selection:text-[#222222]">
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
