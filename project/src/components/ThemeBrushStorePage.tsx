import React from 'react';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from './themes/brush/Header';
import Hero from './themes/brush/Hero';
import Menu from './themes/brush/Menu';
import About from './themes/brush/About';
import Gallery from './themes/brush/Gallery';
import Pricing from './themes/brush/Pricing';
import Staff from './themes/brush/Staff';
import Company from './themes/brush/Company';
import StoreInfo from './themes/brush/StoreInfo';
import Access from './themes/brush/Access';
import FAQ from './themes/brush/FAQ';
import News from './themes/brush/News';
import Contact from './themes/brush/Contact';
import CTA from './themes/brush/CTA';
import Footer from './themes/brush/Footer';

interface ThemeBrushStorePageProps {
  pageData: PageData;
  initialLanguage?: string;
  basePath?: string;
  showDemoBanner?: boolean;
}

export default function ThemeBrushStorePage({ pageData, initialLanguage = 'ja', basePath, showDemoBanner = false }: ThemeBrushStorePageProps) {
  return (
    <LanguageProvider initialLanguage={initialLanguage as any} basePath={basePath}>
      <PageDataProvider data={pageData}>
        <div className="font-sans text-[#1a1a1a] bg-[#F5F0E8] min-h-screen">
          {showDemoBanner && (
            <div className="fixed top-0 left-0 w-full bg-black text-white text-center py-2 z-50 font-bold text-sm">
              Theme Demo: Brush (和の力強さ・筆文字)
            </div>
          )}
          {pageData.header && <Header />}
          <main className={showDemoBanner ? "pt-10" : ""}>
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
