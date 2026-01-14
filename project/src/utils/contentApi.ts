const CONTENT_API_BASE = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content';

export interface SaveContentResult {
  success: boolean;
  error?: string;
}

export async function saveStoreContent(storeId: string, contentData: any): Promise<SaveContentResult> {
  try {
    const response = await fetch(`${CONTENT_API_BASE}/${storeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeId,
        ContentData: contentData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Save failed:', errorText);
      return {
        success: false,
        error: `Save failed: ${response.status} ${response.statusText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Save error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
