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

function App() {
  const [pageData, setPageData] = useState<PageData>(getDefaultPageData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStoreData() {
      try {
        const subdomain = getSubdomainFromHostname(window.location.hostname);
        const pathStoreId = getStoreIdFromPath();

        let storeId: string | null = null;

        if (pathStoreId) {
          storeId = pathStoreId;
        } else if (subdomain && subdomain !== 'www') {
          storeId = subdomain;
        }

        if (storeId) {
          const data = await fetchStoreContent(storeId);

          if (data) {
            const mappedData = mapDynamoDBDataToPageData(data);
            setPageData(mappedData);
          } else {
            setError('Store not found');
          }
        }
      } catch (err) {
        console.error('Error loading store data:', err);
        setError('Failed to load store data');
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
  );
}

export default App;
