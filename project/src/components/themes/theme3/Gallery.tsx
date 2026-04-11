import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { getText } = useLocalize();
  const { language } = useLanguage();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const allCategory = translate('all', language);

  useEffect(() => { setSelectedCategoryIndex(0); }, [language]);

  if (!galleryData || !galleryData.images || galleryData.images.length === 0) return null;

  const sectionTitle = getText(galleryData.sectionTitle);
  if (!sectionTitle) return null;

  const categories = Array.isArray(galleryData.categories) ? galleryData.categories : [];
  const selectedCategoryObj = selectedCategoryIndex === 0 ? null : categories[selectedCategoryIndex - 1];
  const filteredImages = selectedCategoryIndex === 0
    ? galleryData.images
    : galleryData.images.filter(img => getText(img.category) === getText(selectedCategoryObj));

  const lightboxImages = filteredImages.map(img => ({ src: img.url, alt: getText(img.caption) }));

  return (
    <section id="gallery" className="bg-amber-50/50">
      {/* Masonry-style header */}
      <div className="max-w-6xl mx-auto px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-300 pb-10"
        >
          <div>
            <div className="w-8 h-px bg-amber-700 mb-8" />
            <h2 className="font-serif text-5xl md:text-6xl text-stone-800 font-light tracking-wide">{sectionTitle}</h2>
          </div>
          {/* Category filters — refined text tabs (no pill shape) */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-6 text-sm font-serif tracking-widest">
              <button
                onClick={() => setSelectedCategoryIndex(0)}
                className={`uppercase transition-colors border-b pb-1 ${selectedCategoryIndex === 0 ? 'text-amber-800 border-amber-700' : 'text-stone-400 border-transparent hover:text-stone-700'}`}
              >
                {allCategory}
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setSelectedCategoryIndex(idx + 1)}
                  className={`uppercase transition-colors border-b pb-1 ${selectedCategoryIndex === idx + 1 ? 'text-amber-800 border-amber-700' : 'text-stone-400 border-transparent hover:text-stone-700'}`}
                >
                  {getText(cat)}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Masonry-style asymmetric grid */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.url}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              className={`group cursor-pointer overflow-hidden bg-stone-100 ${index % 5 === 0 ? 'row-span-2 col-span-1' : ''}`}
            >
              <div className={`relative overflow-hidden ${index % 5 === 0 ? 'h-full min-h-[520px]' : 'aspect-square'}`}>
                <img
                  src={image.url}
                  alt={getText(image.caption)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/25 transition-colors duration-500 flex items-end p-6">
                  <span className="font-serif text-white text-sm tracking-wide opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {getText(image.caption)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => setLightboxIndex(p => p > 0 ? p - 1 : filteredImages.length - 1)}
          onNext={() => setLightboxIndex(p => p < filteredImages.length - 1 ? p + 1 : 0)}
        />
      )}
    </section>
  );
}
