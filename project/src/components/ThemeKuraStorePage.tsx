import React, { useEffect, useState } from 'react';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

import Header from './themes/kura/Header';
import Hero from './themes/kura/Hero';
import About from './themes/kura/About';
import Menu from './themes/kura/Menu';
import StoreInfo from './themes/kura/StoreInfo';
import Contact from './themes/kura/Contact';
import Footer from './themes/kura/Footer';
import Gallery from './themes/kura/Gallery';
import Staff from './themes/kura/Staff';
import News from './themes/kura/News';
import Access from './themes/kura/Access';
import FAQ from './themes/kura/FAQ';
import CTA from './themes/kura/CTA';
import Pricing from './themes/kura/Pricing';
import Company from './themes/kura/Company';

interface ThemeKuraStorePageProps {
  pageData: PageData;
  initialLanguage?: string;
  basePath?: string;
}

export default function ThemeKuraStorePage({ pageData, initialLanguage = 'ja', basePath }: ThemeKuraStorePageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFFFFF]" />;
  }

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500&family=Noto+Sans+JP:wght@300;400&display=swap');
    :root {
      --font-serif: 'Noto Serif JP', serif;
      --font-sans: 'Noto Sans JP', sans-serif;
    }
    .font-serif {
      font-family: var(--font-serif);
    }
    .font-sans {
      font-family: var(--font-sans);
    }
    body {
      background-color: #FFFFFF;
      color: #2D2D2D;
    }
  `;

  return (
    <LanguageProvider initialLanguage={initialLanguage as any}>
      <PageDataProvider data={pageData}>
        <style>{fonts}</style>
        <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-[#F5F0E8] selection:text-[#1a1a1a]">
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
