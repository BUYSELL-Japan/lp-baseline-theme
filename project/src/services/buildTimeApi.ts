import { unmarshall } from '@aws-sdk/util-dynamodb';
import { readFileSync } from 'fs';
import { join } from 'path';

const API_BASE_URL = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content';

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
        ContentData: localData
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

export async function getStoreList(): Promise<string[]> {
  const useStaticList = process.env.USE_STATIC_STORE_LIST === 'true';

  if (useStaticList) {
    const storeListEnv = process.env.STORE_LIST || 'OKI1011';
    return storeListEnv.split(',').map(s => s.trim());
  }

  try {
    const listEndpoint = process.env.STORE_LIST_API_ENDPOINT || `${API_BASE_URL}/list`;
    const response = await fetch(listEndpoint);

    if (!response.ok) {
      console.warn('[BuildTime API] Failed to fetch store list, using default');
      return ['OKI1011'];
    }

    const data = await response.json();
    return data.stores || ['OKI1011'];
  } catch (error) {
    console.error('[BuildTime API] Error fetching store list:', error);
    return ['OKI1011'];
  }
}
