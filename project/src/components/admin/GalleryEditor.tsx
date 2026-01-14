import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { useEditMode } from '../../contexts/EditModeContext';

export default function GalleryEditor() {
  const { pageData, updateSectionData } = useEditMode();
  const galleryData = pageData.gallery;

  if (!galleryData) return null;

  const images = Array.isArray(galleryData.images) ? galleryData.images : [];

  const handleImageUpload = (index: number, s3Url: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      url: s3Url,
    };
    updateSectionData('gallery', {
      ...galleryData,
      images: updatedImages,
    });
  };

  const handleImageFieldChange = (index: number, field: string, value: any) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    };
    updateSectionData('gallery', {
      ...galleryData,
      images: updatedImages,
    });
  };

  const handleAddImage = () => {
    const newImage = {
      url: '',
      alt: { ja: '', en: '', ko: '', 'zh-tw': '' },
      caption: { ja: '', en: '', ko: '', 'zh-tw': '' },
      category: { ja: '', en: '', ko: '', 'zh-tw': '' },
    };
    updateSectionData('gallery', {
      ...galleryData,
      images: [...images, newImage],
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    updateSectionData('gallery', {
      ...galleryData,
      images: updatedImages,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Section</h2>
          <p className="text-sm text-gray-600 mt-1">Manage gallery images</p>
        </div>
        <button
          onClick={handleAddImage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      <div className="space-y-8">
        {images.map((image: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">Image {index + 1}</h3>
              <button
                onClick={() => handleRemoveImage(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <ImageUpload
              label="Image"
              currentImageUrl={image.url}
              onImageUploaded={(s3Url) => handleImageUpload(index, s3Url)}
              aspectRatio="4/3"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof image.caption === 'object' ? image.caption.ja || '' : image.caption || ''}
                  onChange={(e) => {
                    const current = typeof image.caption === 'object' ? image.caption : {};
                    handleImageFieldChange(index, 'caption', { ...current, ja: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="キャプション"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (English)
                </label>
                <input
                  type="text"
                  value={typeof image.caption === 'object' ? image.caption.en || '' : ''}
                  onChange={(e) => {
                    const current = typeof image.caption === 'object' ? image.caption : {};
                    handleImageFieldChange(index, 'caption', { ...current, en: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Caption"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof image.alt === 'object' ? image.alt.ja || '' : image.alt || ''}
                  onChange={(e) => {
                    const current = typeof image.alt === 'object' ? image.alt : {};
                    handleImageFieldChange(index, 'alt', { ...current, ja: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="代替テキスト"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (English)
                </label>
                <input
                  type="text"
                  value={typeof image.alt === 'object' ? image.alt.en || '' : ''}
                  onChange={(e) => {
                    const current = typeof image.alt === 'object' ? image.alt : {};
                    handleImageFieldChange(index, 'alt', { ...current, en: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Alt text"
                />
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No images yet. Click "Add Image" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
