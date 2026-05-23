import Header from './Header';
import Hero from './Hero';
import About from './About';
import Menu from './Menu';
import Pricing from './Pricing';
import CTA from './CTA';
import Gallery from './Gallery';
import Staff from './Staff';
import News from './News';
import StoreInfo from './StoreInfo';
import Company from './Company';
import Access from './Access';
import FAQ from './FAQ';
import Contact from './Contact';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
        <PageDataProvider data={pageData}>
          <div className="min-h-screen bg-white">
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
