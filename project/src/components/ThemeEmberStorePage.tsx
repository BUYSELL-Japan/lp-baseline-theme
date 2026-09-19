import React from 'react';
// Theme 2 specific components (all)
import Header from './themes/ember/Header';
import Hero from './themes/ember/Hero';
import About from './themes/ember/About';
import Menu from './themes/ember/Menu';
import Pricing from './themes/ember/Pricing';
import CTA from './themes/ember/CTA';
import Gallery from './themes/ember/Gallery';
import Staff from './themes/ember/Staff';
import News from './themes/ember/News';
import StoreInfo from './themes/ember/StoreInfo';
import Company from './themes/ember/Company';
import Access from './themes/ember/Access';
import FAQ from './themes/ember/FAQ';
import Contact from './themes/ember/Contact';
import Footer from './themes/ember/Footer';

import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function ThemeEmberStorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
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
