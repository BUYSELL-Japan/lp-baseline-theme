import { unmarshall } from '@aws-sdk/util-dynamodb';
import { readFileSync } from 'fs';
import { join } from 'path';

const API_BASE_URL = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content';
const STORE_LIST_API_URL = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/stores';

export interface LandingPageContent {
  storeId: string;
  subdomainName: string;
  ContentData?: any;
  [key: string]: any;
}

export interface StoreInfo {
  storeId: string;
  subdomain: string;
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

export async function fetchStoreContentAtBuildTime(storeId: string): Promise<LandingPageContent | null> {
  try {
    console.log(`[BuildTime API] Fetching content for storeId: ${storeId}`);

    const useFallbackData = process.env.USE_FALLBACK_DATA === 'true';

    let rawData;

    if (useFallbackData) {
      console.log('[BuildTime API] Using fallback local data');
      const localPath = join(process.cwd(), 'public', 'dynamodb-data-OKI1011-multilang.json');
      const localData = JSON.parse(readFileSync(localPath, 'utf-8'));
      rawData = {
        storeId: storeId,
        subdomainName: 'teststore',
        ...localData
      };
    } else {
      console.log('[BuildTime API] Fetching from production API');
      const response = await fetch(`${API_BASE_URL}/${storeId}`);

      if (!response.ok) {
        console.error(`[BuildTime API] Failed to fetch store content: ${response.status}`);
        return null;
      }

      rawData = await response.json();
    }

    const processedData = deepUnmarshall(rawData);

    if (processedData.ContentData) {
      if (typeof processedData.ContentData === 'string') {
        processedData.ContentData = JSON.parse(processedData.ContentData);
      }
    }

    return processedData as LandingPageContent;
  } catch (error) {
    console.error('[BuildTime API] Error fetching store content:', error);
    return null;
  }
}

export async function getStoreList(): Promise<StoreInfo[]> {
  console.log('[BuildTime API] getStoreList called');
  console.log('[BuildTime API] USE_STATIC_STORE_LIST:', process.env.USE_STATIC_STORE_LIST);
  console.log('[BuildTime API] STORE_LIST:', process.env.STORE_LIST);

  const useStaticList = process.env.USE_STATIC_STORE_LIST === 'true';
  console.log('[BuildTime API] useStaticList:', useStaticList);

  if (useStaticList) {
    const storeListEnv = process.env.STORE_LIST || 'OKI1011';
    console.log('[BuildTime API] Using static store list:', storeListEnv);
    const stores = storeListEnv.split(',').map(s => ({
      storeId: s.trim(),
      subdomain: s.trim().toLowerCase()
    }));
    console.log('[BuildTime API] Parsed stores:', stores);
    return stores;
  }

  console.log('[BuildTime API] Fetching from API:', STORE_LIST_API_URL);
  try {
    const response = await fetch(STORE_LIST_API_URL);

    if (!response.ok) {
      console.warn('[BuildTime API] Failed to fetch store list, using default');
      return [{ storeId: 'OKI1011', subdomain: 'oki1011' }];
    }

    const data = await response.json();

    if (data.stores && Array.isArray(data.stores)) {
      console.log(`[BuildTime API] Fetched ${data.count || data.stores.length} stores`);
      return data.stores;
    }

    console.warn('[BuildTime API] Invalid response format, using default');
    return [{ storeId: 'OKI1011', subdomain: 'oki1011' }];
  } catch (error) {
    console.error('[BuildTime API] Error fetching store list:', error);
    return [{ storeId: 'OKI1011', subdomain: 'oki1011' }];
  }
}
