import { unmarshall } from '@aws-sdk/util-dynamodb';

const API_BASE_URL = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content';

function isLocalDevelopment(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.MODE === 'development';
  }
  return false;
}

export interface LandingPageContent {
  storeId: string;
  subdomainName: string;
  ContentData?: any;
  [key: string]: any;
}

function isDynamoDBFormat(data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  const keys = Object.keys(data);
  if (keys.length === 0) return false;

  const dynamoTypes = ['S', 'N', 'B', 'SS', 'NS', 'BS', 'M', 'L', 'NULL', 'BOOL'];

  for (const key of keys) {
    const value = data[key];
    if (value && typeof value === 'object') {
      const valueKeys = Object.keys(value);
      if (valueKeys.length === 1 && dynamoTypes.includes(valueKeys[0])) {
        return true;
      }
    }
  }

  return false;
}

function deepUnmarshall(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => deepUnmarshall(item));
  }

  if (isDynamoDBFormat(data)) {
    console.log('[deepUnmarshall] Found DynamoDB format, unmarshalling:', Object.keys(data));
    const unmarshalled = unmarshall(data);
    return deepUnmarshall(unmarshalled);
  }

  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object') {
      result[key] = deepUnmarshall(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export async function fetchStoreContent(storeId: string): Promise<LandingPageContent | null> {
  try {
    console.log(`[API] Fetching content for storeId: ${storeId}`);
    const useLocalData = isLocalDevelopment();
    console.log(`[API] USE_LOCAL_DATA: ${useLocalData}`);

    let rawData;

    if (useLocalData) {
      console.log('[API] Using local sample data');
      const response = await fetch('/dynamodb-data-OKI1011-multilang.json');
      if (!response.ok) {
        console.error(`[API] Failed to fetch local data: ${response.status}`);
        return null;
      }
      const localData = await response.json();
      rawData = {
        ...localData,
        storeId: storeId || localData.StoreID,
        subdomainName: 'teststore'
      };
    } else {
      console.log('[API] Fetching from production API');
      const response = await fetch(`${API_BASE_URL}/${storeId}`);

      if (!response.ok) {
        console.error(`[API] Failed to fetch store content: ${response.status}`);
        return null;
      }

      rawData = await response.json();
      console.log('[API] Raw production API response:', {
        keys: Object.keys(rawData),
        hasContentData: !!rawData.ContentData,
        contentDataType: typeof rawData.ContentData,
        contentDataKeys: rawData.ContentData ? Object.keys(rawData.ContentData).slice(0, 10) : null,
        sampleContentData: rawData.ContentData ? JSON.stringify(rawData.ContentData).substring(0, 200) : null
      });
    }

    console.log('[API] Raw API Response:', rawData);
    console.log('[API] Raw API Response type:', typeof rawData);
    console.log('[API] Raw API Response keys:', Object.keys(rawData));

    const processedData = deepUnmarshall(rawData);
    console.log('[API] After deep unmarshall:', processedData);
    console.log('[API] Processed data keys:', Object.keys(processedData));

    if (processedData.ContentData) {
      console.log('[API] ContentData found, type:', typeof processedData.ContentData);
      if (typeof processedData.ContentData === 'string') {
        console.log('[API] ContentData is string, parsing...');
        processedData.ContentData = JSON.parse(processedData.ContentData);
      }
      console.log('[API] ContentData keys:', Object.keys(processedData.ContentData || {}));
    }

    return processedData as LandingPageContent;
  } catch (error) {
    console.error('[API] Error fetching store content:', error);
    return null;
  }
}

export function getSubdomainFromHostname(hostname: string): string | null {
  const parts = hostname.split('.');

  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}

export function getStoreIdFromPath(): string | null {
  const pathParts = window.location.pathname.split('/').filter(Boolean);

  if (pathParts.length >= 2 && pathParts[0] === 'stores') {
    return pathParts[1];
  }

  return null;
}
