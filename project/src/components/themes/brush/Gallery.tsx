import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useLocalize } from '../../../hooks/useLocalize';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const { getText } = useLocalize();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!galleryData || !galleryData.images || galleryData.images.length === 0) return null;

  const lightboxImages = galleryData.images.map((image) => ({
    src: image.url,
    alt: getText(image.caption),
  }));

  return (
    <section id="gallery" className="scroll-mt-20 py-24 md:py-32 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-serif font-black tracking-tight text-[#1a1a1a] mb-6"
        >
          {getText(galleryData.sectionTitle)}
        </motion.h2>
        <div className="w-24 h-2 bg-[#C0392B] mx-auto" />
      </div>

      <div className="w-full bg-[#F5F0E8] p-[1px]">
        {/* The grid gap acts as the "thin sumi line" */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px]">
          {galleryData.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              className="relative aspect-square overflow-hidden bg-[#F5F0E8] group cursor-pointer"
            >
              <img
                src={image.url} 
                alt={getText(image.caption) || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {image.caption && getText(image.caption) && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                  <p className="text-[#1a1a1a] text-center font-serif font-bold text-lg md:text-xl tracking-widest">
                    {getText(image.caption)}
                  </p>
                </div>
              )}
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
