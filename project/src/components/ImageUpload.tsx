import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImageToS3, validateImageFile } from '../utils/imageUpload';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (s3Url: string) => void;
  label?: string;
  aspectRatio?: string;
  className?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  label = 'Upload Image',
  aspectRatio = '16/9',
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setIsUploading(true);

    const result = await uploadImageToS3(file);

    setIsUploading(false);

    if (result.success && result.s3Url) {
      onImageUploaded(result.s3Url);
      setPreview(result.s3Url);
      URL.revokeObjectURL(previewUrl);
    } else {
      setError(result.error || 'Upload failed');
      setPreview(currentImageUrl || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : preview
            ? 'border-gray-300'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{ aspectRatio }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={handleClick}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <Upload className="w-4 h-4" />
                  Change
                </button>
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleClick}
            className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
            type="button"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-3" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF or WebP (max 10MB)</p>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
