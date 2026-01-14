import { useState } from 'react';
import ImageUpload from '../ImageUpload';
import { useEditMode } from '../../contexts/EditModeContext';
import type { HeroData } from '../../data/types';

export default function HeroEditor() {
  const { pageData, updateSectionData } = useEditMode();
  const heroData = pageData.hero;

  if (!heroData) return null;

  const handleImageUpload = (s3Url: string) => {
    updateSectionData('hero', {
      ...heroData,
      backgroundImage: s3Url,
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    updateSectionData('hero', {
      ...heroData,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>
        <p className="text-sm text-gray-600 mt-1">Edit the main hero section of your page</p>
      </div>

      <div>
        <ImageUpload
          label="Background Image"
          currentImageUrl={heroData.backgroundImage}
          onImageUploaded={handleImageUpload}
          aspectRatio="16/9"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (Japanese)
          </label>
          <input
            type="text"
            value={typeof heroData.title === 'object' ? heroData.title.ja || '' : heroData.title || ''}
            onChange={(e) => {
              const currentTitle = typeof heroData.title === 'object' ? heroData.title : {};
              handleFieldChange('title', { ...currentTitle, ja: e.target.value });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Japanese title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (English)
          </label>
          <input
            type="text"
            value={typeof heroData.title === 'object' ? heroData.title.en || '' : ''}
            onChange={(e) => {
              const currentTitle = typeof heroData.title === 'object' ? heroData.title : {};
              handleFieldChange('title', { ...currentTitle, en: e.target.value });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter English title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle (Japanese)
          </label>
          <input
            type="text"
            value={typeof heroData.subtitle === 'object' ? heroData.subtitle.ja || '' : heroData.subtitle || ''}
            onChange={(e) => {
              const currentSubtitle = typeof heroData.subtitle === 'object' ? heroData.subtitle : {};
              handleFieldChange('subtitle', { ...currentSubtitle, ja: e.target.value });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Japanese subtitle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle (English)
          </label>
          <input
            type="text"
            value={typeof heroData.subtitle === 'object' ? heroData.subtitle.en || '' : ''}
            onChange={(e) => {
              const currentSubtitle = typeof heroData.subtitle === 'object' ? heroData.subtitle : {};
              handleFieldChange('subtitle', { ...currentSubtitle, en: e.target.value });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter English subtitle"
          />
        </div>
      </div>
    </div>
  );
}
