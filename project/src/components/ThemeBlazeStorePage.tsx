import React from 'react';
// Theme 2 specific components (all)
import Header from './themes/blaze/Header';
import Hero from './themes/blaze/Hero';
import About from './themes/blaze/About';
import Menu from './themes/blaze/Menu';
import Pricing from './themes/blaze/Pricing';
import CTA from './themes/blaze/CTA';
import Gallery from './themes/blaze/Gallery';
import Staff from './themes/blaze/Staff';
import News from './themes/blaze/News';
import StoreInfo from './themes/blaze/StoreInfo';
import Company from './themes/blaze/Company';
import Access from './themes/blaze/Access';
import FAQ from './themes/blaze/FAQ';
import Contact from './themes/blaze/Contact';
import Footer from './themes/blaze/Footer';

import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function ThemeBlazeStorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="relative w-full min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-blue-500/30 font-sans overflow-x-clip">
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
  );
}
