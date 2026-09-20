import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!galleryData) return <SectionError sectionName="Gallery" error="No gallery data available" />;
  if (!galleryData.images || galleryData.images.length === 0) return null;

  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language);

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
              onClick={() => setSelectedImage(image.url)}
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

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#FFFFFF]/95 backdrop-blur flex items-center justify-center p-4 md:p-12 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-[#888888] hover:text-[#222222] text-2xl transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={selectedImage}
              alt="Gallery Preview"
              className="max-w-full max-h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
