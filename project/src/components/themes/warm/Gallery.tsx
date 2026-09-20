import React, { useState } from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  if (!galleryData || !galleryData.images || galleryData.images.length === 0) return null;
  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language) || 'Gallery';
  const lightboxImages = galleryData.images.map((img) => ({
    src: img.url,
    alt: getLocalizedValue(img, 'caption', language) || '',
  }));

  return (
    <section id="gallery" className="py-24 bg-[#FFFBF0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-[#92400E] inline-block relative">
          {sectionTitle}
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#D97706] rounded-full"></span>
        </h2>
      </div>
      
      {/* Mobile: Horizontal Filmstrip / PC: Grid Layout */}
      <div className="w-full overflow-x-auto md:overflow-visible pb-12 pt-4 hide-scrollbar cursor-grab active:cursor-grabbing md:cursor-auto md:active:cursor-auto">
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 px-6 md:px-8 w-max md:w-full md:max-w-7xl md:mx-auto snap-x snap-mandatory md:snap-none">
          {galleryData.images.map((img, index) => {
            const caption = getLocalizedValue(img, 'caption', language);
            return (
              <div key={index} className="w-64 sm:w-80 md:w-auto flex-shrink-0 group snap-center md:snap-align-none">
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-[#FEF3C7] transform transition-all duration-300 md:group-hover:-translate-y-3 md:group-hover:rotate-2">
                  <div
                    className="w-full aspect-square overflow-hidden rounded-2xl cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt={caption || ''} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                  {caption && (
                    <div className="pt-4 pb-2 text-center">
                      <h3 className="text-[#1C1917] font-bold">{caption}</h3>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => setLightboxIndex((p) => (p > 0 ? p - 1 : lightboxImages.length - 1))}
          onNext={() => setLightboxIndex((p) => (p < lightboxImages.length - 1 ? p + 1 : 0))}
        />
      )}
    </section>
  );
}
