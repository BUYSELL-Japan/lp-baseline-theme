import React from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  if (!galleryData || !galleryData.images || galleryData.images.length === 0) return null;
  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language) || 'Gallery';

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-black text-center mb-16 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#F59E0B]">
          {sectionTitle}
        </h2>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryData.images.map((img, index) => {
            const caption = getLocalizedValue(img, 'caption', language);
            return (
              <div key={index} className="break-inside-avoid relative group overflow-hidden bg-[#111] shadow-[5px_5px_0_0_#333] hover:shadow-[8px_8px_0_0_#DC2626] transition-all mb-6">
                <img 
                  src={img.url} 
                  alt={caption || ''} 
                  className="w-full h-auto object-cover block"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#DC2626]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                  <h3 className="text-2xl font-black text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {caption}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
