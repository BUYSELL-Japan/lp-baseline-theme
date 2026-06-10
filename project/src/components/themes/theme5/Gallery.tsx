import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { getText } = useLocalize();
  const { language } = useLanguage();
  const allCategory = translate('all', language);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!galleryData || !galleryData.images) return null;

  const categories = galleryData.categories && Array.isArray(galleryData.categories) ? galleryData.categories : [];
  const filteredImages = selectedCategoryIndex === 0
    ? galleryData.images
    : galleryData.images.filter(img => getText(img.category) === getText(categories[selectedCategoryIndex - 1]));

  const lightboxImages = filteredImages.map((img) => ({
    src: img.url,
    alt: getText(img.caption),
  }));

  const sectionTitle = getText(galleryData.sectionTitle);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-gray-100 relative overflow-hidden">
      {/* Right side vertical accent */}
      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-[#D4AF37]/30 hidden lg:block" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-0.5 h-10 bg-[#C0392B]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Gallery</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
              {sectionTitle}
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-[#D4AF37]" />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoryIndex(0)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                selectedCategoryIndex === 0
                  ? 'bg-gray-900 text-[#D4AF37] border-gray-900'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-900 hover:text-gray-900'
              }`}
            >
              {allCategory}
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx + 1}
                onClick={() => setSelectedCategoryIndex(idx + 1)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  selectedCategoryIndex === idx + 1
                    ? 'bg-gray-900 text-[#D4AF37] border-gray-900'
                    : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {getText(cat)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid - Editorial style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 auto-rows-[200px] lg:auto-rows-[240px]">
          {filteredImages.map((image, index) => {
            const spans = [
              'col-span-2 row-span-2',
              'col-span-1 row-span-1',
              'col-span-1 row-span-2',
              'col-span-1 row-span-1',
              'col-span-1 row-span-1',
              'col-span-2 row-span-1',
            ];
            const spanClass = spans[index % spans.length];

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                className={`relative cursor-pointer group overflow-hidden ${spanClass}`}
              >
                <img
                  src={image.url}
                  alt={getText(image.caption)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gold border on hover */}
                <div className="absolute inset-0 border border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                {/* Caption overlay */}
                <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 lg:p-6">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">{getText(image.caption)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {lightboxOpen && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrevious={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1))}
            onNext={() => setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0))}
          />
        )}
      </div>
    </section>
  );
}
