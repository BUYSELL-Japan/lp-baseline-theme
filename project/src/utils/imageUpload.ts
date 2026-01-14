const UPLOAD_URL_ENDPOINT = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/assets/upload-url';

export interface UploadResult {
  success: boolean;
  s3Url?: string;
  error?: string;
}

export async function uploadImageToS3(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(UPLOAD_URL_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data.s3Url) {
      return {
        success: true,
        s3Url: data.s3Url,
      };
    }

    return {
      success: false,
      error: 'No S3 URL returned from server',
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.',
    };
  }

  return { valid: true };
}
