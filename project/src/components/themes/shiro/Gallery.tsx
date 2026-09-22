import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!galleryData || !galleryData.images || galleryData.images.length === 0) {
    return <SectionError sectionName="Gallery" error="No gallery images available" data={galleryData} />;
  }

  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language);
  const sectionSubtitle = getLocalizedValue(galleryData, 'sectionSubtitle', language);
  const images = galleryData.images;

  return (
    <section id="gallery" className="scroll-mt-20 bg-[#F8F8F8] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-base text-[#333333]">{sectionSubtitle}</p>
          )}
        </motion.div>

        {/* Gallery grid with 2px gap on white background to create thin white lines */}
        <div className="bg-[#FFFFFF] grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
              onClick={() => {
                setPhotoIndex(index);
                setLightboxOpen(true);
              }}
              className="aspect-square relative cursor-pointer overflow-hidden group bg-[#E5E5E5]"
            >
              <img 
                src={image.url} 
                alt={getLocalizedValue(image, 'caption', language) || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Light green overlay on hover */}
              <div className="absolute inset-0 bg-[#95D5B2]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                {image.caption && (
                  <p className="text-[#333333] text-center font-sans font-bold text-sm md:text-base translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ">
                    {getLocalizedValue(image, 'caption', language)}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images.map((image) => ({
              src: image.url,
              alt: getLocalizedValue(image, 'caption', language) || '',
            }))}
            currentIndex={photoIndex}
            onClose={() => setLightboxOpen(false)}
            onPrevious={() => setPhotoIndex((p) => (p > 0 ? p - 1 : images.length - 1))}
            onNext={() => setPhotoIndex((p) => (p < images.length - 1 ? p + 1 : 0))}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
