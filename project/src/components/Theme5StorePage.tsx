import Header from './themes/theme5/Header';
import Hero from './themes/theme5/Hero';
import About from './themes/theme5/About';
import Menu from './themes/theme5/Menu';
import Pricing from './themes/theme5/Pricing';
import CTA from './themes/theme5/CTA';
import Gallery from './themes/theme5/Gallery';
import Staff from './themes/theme5/Staff';
import News from './themes/theme5/News';
import StoreInfo from './themes/theme5/StoreInfo';
import Company from './themes/theme5/Company';
import Access from './themes/theme5/Access';
import FAQ from './themes/theme5/FAQ';
import Contact from './themes/theme5/Contact';
import Footer from './themes/theme5/Footer';
import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function Theme5StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="min-h-screen bg-gray-100 selection:bg-[#D4AF37]/30 selection:text-gray-900">
            {pageData.header && <Header />}
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
            {pageData.footer && <Footer />}
          </div>
        </PageDataProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
