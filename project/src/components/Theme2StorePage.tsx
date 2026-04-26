import React from 'react';
// Theme 2 specific components (all)
import Header from './themes/theme2/Header';
import Hero from './themes/theme2/Hero';
import About from './themes/theme2/About';
import Menu from './themes/theme2/Menu';
import Pricing from './themes/theme2/Pricing';
import CTA from './themes/theme2/CTA';
import Gallery from './themes/theme2/Gallery';
import Staff from './themes/theme2/Staff';
import Reviews from './themes/theme2/Reviews';
import News from './themes/theme2/News';
import StoreInfo from './themes/theme2/StoreInfo';
import Company from './themes/theme2/Company';
import Access from './themes/theme2/Access';
import FAQ from './themes/theme2/FAQ';
import Contact from './themes/theme2/Contact';
import Footer from './themes/theme2/Footer';

import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function Theme2StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans overflow-x-hidden">
            {pageData.header && <Header />}
            <main>
              {pageData.hero && <Hero />}
              {pageData.about && <About />}
              {pageData.menu && <Menu />}
              {pageData.pricing && <Pricing />}
              {pageData.cta && <CTA />}
              {pageData.gallery && <Gallery />}
              {pageData.staff && <Staff />}
              {pageData.reviews && <Reviews />}
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
