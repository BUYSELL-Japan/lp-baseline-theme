import React from 'react';
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

export default function ThemeBrushStorePage({ initialData, initialLanguage, showDemoBanner = false }: { initialData: any, initialLanguage: string, showDemoBanner?: boolean }) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageDataProvider data={initialData}>
        <div className="font-sans text-[#1a1a1a] bg-[#F5F0E8] min-h-screen">
          {showDemoBanner && (
            <div className="fixed top-0 left-0 w-full bg-black text-white text-center py-2 z-50 font-bold text-sm">
              Theme Demo: Brush (和の力強さ・筆文字)
            </div>
          )}
          <Header />
          <main className={showDemoBanner ? "pt-10" : ""}>
            <Hero />
            <Menu />
            <About />
            <Gallery />
            <Pricing />
            <Staff />
            <Company />
            <StoreInfo />
            <Access />
            <FAQ />
            <News />
            <Contact />
            <CTA />
          </main>
          <Footer />
        </div>
      </PageDataProvider>
    </LanguageProvider>
  );
}
