import React from 'react';
// Theme 2 specific components (all)
import Header from './themes/warm/Header';
import Hero from './themes/warm/Hero';
import About from './themes/warm/About';
import Menu from './themes/warm/Menu';
import Pricing from './themes/warm/Pricing';
import CTA from './themes/warm/CTA';
import Gallery from './themes/warm/Gallery';
import Staff from './themes/warm/Staff';
import News from './themes/warm/News';
import StoreInfo from './themes/warm/StoreInfo';
import Company from './themes/warm/Company';
import Access from './themes/warm/Access';
import FAQ from './themes/warm/FAQ';
import Contact from './themes/warm/Contact';
import Footer from './themes/warm/Footer';

import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function ThemeWarmStorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');
        .font-maru, .font-maru * { font-family: 'Zen Maru Gothic', sans-serif !important; }
      `}</style>
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="relative w-full min-h-screen bg-[#FFFBF0] text-[#1C1917] selection:bg-blue-500/30 font-sans font-maru overflow-x-clip">
            {pageData.header && <Header />}
            <main>
              {pageData.hero && <Hero />}
              {pageData.about && <About />}
              {pageData.menu && <Menu />}
              {pageData.pricing && <Pricing />}
              {pageData.cta && <CTA />}
              {pageData.gallery && <Gallery />}
              {pageData.staff && <Staff />}
              {pageData.news && <News />}
              {pageData.storeInfo && <StoreInfo />}
              {pageData.company && <Company />}
              {pageData.access && <Access />}
              {pageData.faq && <FAQ />}
              {pageData.contact && <Contact />}
            </main>
            {pageData.footer && <Footer />}
          </div>
        </PageDataProvider>
      </LanguageProvider>
    </ErrorBoundary>
    </>
  );
}
