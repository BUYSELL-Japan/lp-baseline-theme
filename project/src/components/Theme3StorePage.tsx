import React from 'react';
// Theme 3 specific components — ALL sections
import Header from './themes/theme3/Header';
import Hero from './themes/theme3/Hero';
import About from './themes/theme3/About';
import Menu from './themes/theme3/Menu';
import Pricing from './themes/theme3/Pricing';
import CTA from './themes/theme3/CTA';
import Gallery from './themes/theme3/Gallery';
import Staff from './themes/theme3/Staff';
import Reviews from './themes/theme3/Reviews';
import News from './themes/theme3/News';
import StoreInfo from './themes/theme3/StoreInfo';
import Company from './themes/theme3/Company';
import Access from './themes/theme3/Access';
import FAQ from './themes/theme3/FAQ';
import Contact from './themes/theme3/Contact';
import Footer from './themes/theme3/Footer';

import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function Theme3StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="min-h-screen bg-stone-50 text-stone-800">
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
