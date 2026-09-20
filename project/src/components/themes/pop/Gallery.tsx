import React, { useState } from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import { motion } from 'framer-motion';
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

  const overlayColors = ['bg-[#FF006E]', 'bg-[#FB5607]', 'bg-[#FFBE0B]', 'bg-[#8ECAE6]', 'bg-[#7B2FBE]'];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-[#1a1a1a] tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        
        {/* PC: 3-column, Mobile: 2-column square grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {galleryData.images.map((img, index) => {
            const caption = getLocalizedValue(img, 'caption', language);
            const overlayColor = overlayColors[index % overlayColors.length];
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer"
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
                />
                
                {/* Vivid Color Overlay */}
                <div className={`absolute inset-0 ${overlayColor}/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4`}>
                  {caption && (
                    <h3 className="text-white font-black text-center text-lg md:text-2xl drop-shadow-md">
                      {caption}
                    </h3>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

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
