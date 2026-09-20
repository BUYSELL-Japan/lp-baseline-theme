import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!galleryData) return <SectionError sectionName="Gallery" error="No gallery data available" />;
  if (!galleryData.images || galleryData.images.length === 0) return null;

  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language);
  const lightboxImages = galleryData.images.map((image) => ({
    src: image.url,
    alt: getLocalizedValue(image, 'caption', language) || '',
  }));

  return (
    <section id="gallery" className="bg-[#F5F5F3] py-32 md:py-48 px-4 md:px-0 border-b border-[#EEEEEE]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
          {sectionTitle || 'ギャラリー'}
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#FFFFFF] p-[1px]">
          {galleryData.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="aspect-square relative group overflow-hidden cursor-pointer bg-[#F5F5F3]"
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <img 
                src={image.url} 
                alt={getLocalizedValue(image, 'caption', language) || ''} 
                className="w-full h-full object-cover grayscale-[30%] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#F5F5F3]/0 group-hover:bg-[#F5F5F3]/30 transition-colors duration-500" />
            </motion.div>
          ))}
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
