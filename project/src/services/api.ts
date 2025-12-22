import { unmarshall } from '@aws-sdk/util-dynamodb';

const API_BASE_URL = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content';

export interface LandingPageContent {
  storeId: string;
  subdomainName: string;
  ContentData?: any;
  [key: string]: any;
}

export async function fetchStoreContent(storeId: string): Promise<LandingPageContent | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${storeId}`);

    if (!response.ok) {
      console.error(`Failed to fetch store content: ${response.status}`);
      return null;
    }

    const rawData = await response.json();
    console.log('Raw API Response:', rawData);

    const unmarshalled = unmarshall(rawData);
    console.log('Unmarshalled data:', unmarshalled);

    return unmarshalled;
  } catch (error) {
    console.error('Error fetching store content:', error);
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
