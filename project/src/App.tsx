import { useState, useEffect } from 'react';
import StorePage from './components/StorePage';
import Theme2StorePage from './components/Theme2StorePage';
import Theme3StorePage from './components/Theme3StorePage';
import { fetchStoreContent, getSubdomainFromHostname, getStoreIdFromPath, getStoreInfo } from './services/api';
import { mapDynamoDBDataToPageData, getDefaultPageData, type PageData } from './services/dataMapper';

function App() {
  const [pageData, setPageData] = useState<PageData>(getDefaultPageData());
  const [templateId, setTemplateId] = useState<string>('theme1');

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

        if (isDevelopment && !pathStoreId) {
          console.log('[App] Development mode without storeId, loading local JSON data...');
          try {
            const response = await fetch('/dynamodb-data-OKI1011-multilang.json');
            if (response.ok) {
              const localData = await response.json();
              console.log('[App] Local JSON loaded:', localData);
              const mappedData = mapDynamoDBDataToPageData(localData);
              console.log('[App] Setting mapped local data');
              setPageData(mappedData);
              setIsLoading(false);
              return;
            }
          } catch (localErr) {
            console.log('[App] Could not load local JSON, falling back to API or default');
          }
        }

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
          // 並行リクエストでコンテンツと設定(テーマ)を両方取得
          const [data, settings] = await Promise.all([
            fetchStoreContent(storeId),
            getStoreInfo(storeId)
          ]);

          console.log('[App] Settings fetched:', settings);
          setTemplateId(settings.templateId);

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

  const renderTheme = () => {
    switch (templateId) {
      case 'theme2':
        return <Theme2StorePage pageData={pageData} />;
      case 'theme3':
        return <Theme3StorePage pageData={pageData} />;
      case 'theme1':
      default:
        return <StorePage pageData={pageData} />;
    }
  };

  return renderTheme();
}

export default App;
