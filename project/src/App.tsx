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

        (()=>{})('[App] Hostname:', window.location.hostname);
        (()=>{})('[App] Pathname:', window.location.pathname);
        (()=>{})('[App] Subdomain:', subdomain);
        (()=>{})('[App] Path StoreId:', pathStoreId);
        (()=>{})('[App] Is Development:', isDevelopment);

        if (isDevelopment && !pathStoreId) {
          (()=>{})('[App] Development mode without storeId, loading local JSON data...');
          try {
            const response = await fetch('/dynamodb-data-OKI1011-multilang.json');
            if (response.ok) {
              const localData = await response.json();
              (()=>{})('[App] Local JSON loaded:', localData);
              const mappedData = mapDynamoDBDataToPageData(localData);
              (()=>{})('[App] Setting mapped local data');
              setPageData(mappedData);
              setIsLoading(false);
              return;
            }
          } catch (localErr) {
            (()=>{})('[App] Could not load local JSON, falling back to API or default');
          }
        }

        let storeId: string | null = null;

        if (pathStoreId) {
          storeId = pathStoreId;
          (()=>{})('[App] Using pathStoreId:', storeId);
        } else if (subdomain && subdomain !== 'www') {
          storeId = subdomain;
          (()=>{})('[App] Using subdomain as storeId:', storeId);
        }

        if (storeId) {
          (()=>{})('[App] Fetching data for storeId:', storeId);
          // 並行リクエストでコンテンツと設定(テーマ)を両方取得
          const [data, settings] = await Promise.all([
            fetchStoreContent(storeId),
            getStoreInfo(storeId)
          ]);

          (()=>{})('[App] Settings fetched:', settings);
          setTemplateId(settings.templateId);

          if (data) {
            (()=>{})('[App] Data fetched successfully, mapping...');
            const mappedData = mapDynamoDBDataToPageData(data);
            (()=>{})('[App] Setting mapped data');
            setPageData(mappedData);
          } else {
            (()=>{})('[App] No data returned from API');
            if (isDevelopment) {
              (()=>{})('[App] Using default data in development mode');
              setPageData(getDefaultPageData());
            } else {
              setError('Store not found');
            }
          }
        } else {
          (()=>{})('[App] No storeId found');
          if (isDevelopment) {
            (()=>{})('[App] No storeId found, using default data in development mode');
            setPageData(getDefaultPageData());
          } else {
            setError('Store not found');
          }
        }
      } catch (err) {
        console.error('[App] Error loading store data:', err);
        const isDevelopment = import.meta.env.DEV;
        if (isDevelopment) {
          (()=>{})('[App] Error occurred, using default data in development mode');
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
