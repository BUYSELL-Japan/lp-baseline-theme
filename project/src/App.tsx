import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Gallery from './components/Gallery';
import Staff from './components/Staff';
import Reviews from './components/Reviews';
import News from './components/News';
import StoreInfo from './components/StoreInfo';
import Company from './components/Company';
import Access from './components/Access';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { fetchStoreContent, getSubdomainFromHostname, getStoreIdFromPath } from './services/api';
import { mapDynamoDBDataToPageData, getDefaultPageData, type PageData } from './services/dataMapper';
import { PageDataProvider } from './contexts/PageDataContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [pageData, setPageData] = useState<PageData>(getDefaultPageData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStoreData() {
      try {
        const subdomain = getSubdomainFromHostname(window.location.hostname);
        const pathStoreId = getStoreIdFromPath();
        const isDevelopment = import.meta.env.DEV;

        console.log('[App] Hostname:', window.location.hostname);
        console.log('[App] Pathname:', window.location.pathname);
        console.log('[App] Subdomain:', subdomain);
        console.log('[App] Path StoreId:', pathStoreId);
        console.log('[App] Is Development:', isDevelopment);

        let storeId: string | null = null;

        if (pathStoreId) {
          storeId = pathStoreId;
          console.log('[App] Using pathStoreId:', storeId);
        } else if (subdomain && subdomain !== 'www') {
          storeId = subdomain;
          console.log('[App] Using subdomain as storeId:', storeId);
        }

        if (storeId) {
          console.log('[App] Fetching data for storeId:', storeId);
          const data = await fetchStoreContent(storeId);

          if (data) {
            console.log('[App] Data fetched successfully, mapping...');
            const mappedData = mapDynamoDBDataToPageData(data);
            console.log('[App] Setting mapped data');
            setPageData(mappedData);
          } else {
            console.log('[App] No data returned from API');
            if (isDevelopment) {
              console.log('[App] Using default data in development mode');
              setPageData(getDefaultPageData());
            } else {
              setError('Store not found');
            }
          }
        } else {
          console.log('[App] No storeId found');
          if (isDevelopment) {
            console.log('[App] No storeId found, using default data in development mode');
            setPageData(getDefaultPageData());
          } else {
            setError('Store not found');
          }
        }
      } catch (err) {
        console.error('[App] Error loading store data:', err);
        const isDevelopment = import.meta.env.DEV;
        if (isDevelopment) {
          console.log('[App] Error occurred, using default data in development mode');
          setPageData(getDefaultPageData());
        } else {
          setError('Failed to load store data');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadStoreData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
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
  );
}

export default App;
