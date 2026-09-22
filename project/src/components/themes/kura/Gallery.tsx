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

  return (
    <section id="gallery" className="scroll-mt-20 py-32 md:py-48 bg-[#FAFAF7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24 md:mb-32">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em]">
            {sectionTitle}
          </h2>
        </div>
        
        {/* PC: 2-column grid, Mobile: 1-column stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-px md:bg-[#1a1a1a] border border-transparent md:border-[#1a1a1a] p-px">
          {galleryData.images.map((img, index) => {
            const caption = getLocalizedValue(img, 'caption', language);
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="group relative aspect-square bg-[#FFFFFF] overflow-hidden cursor-pointer"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={img.url}
                  alt={caption || ''}
                  className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  loading="lazy"
                />
                {caption && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <h3 className="text-[#FFFFFF] font-serif tracking-widest text-xl">{caption}</h3>
                  </div>
                )}
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
