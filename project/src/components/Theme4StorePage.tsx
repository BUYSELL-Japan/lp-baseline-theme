import Header from './themes/theme4/Header';
import Hero from './themes/theme4/Hero';
import About from './themes/theme4/About';
import Menu from './themes/theme4/Menu';
import Pricing from './themes/theme4/Pricing';
import CTA from './themes/theme4/CTA';
import Gallery from './themes/theme4/Gallery';
import Staff from './themes/theme4/Staff';
import Reviews from './themes/theme4/Reviews';
import News from './themes/theme4/News';
import StoreInfo from './themes/theme4/StoreInfo';
import Company from './themes/theme4/Company';
import Access from './themes/theme4/Access';
import FAQ from './themes/theme4/FAQ';
import Contact from './themes/theme4/Contact';
import Footer from './themes/theme4/Footer';
import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function Theme4StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="min-h-screen bg-amber-50 selection:bg-red-200 selection:text-red-900">
            {pageData.header && <Header />}
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
            {pageData.footer && <Footer />}
          </div>
        </PageDataProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
