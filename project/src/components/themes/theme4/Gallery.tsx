import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <section id="gallery" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-yellow-400 opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-24 max-w-2xl"
        >
          <h2 className="text-6xl md:text-9xl font-black text-rose-950 mb-8 italic tracking-tighter leading-none">
            {sectionTitle}
          </h2>
          <div className="w-32 h-6 bg-red-600 rounded-full" />
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-20 justify-start">
          <button
            onClick={() => setSelectedCategoryIndex(0)}
            className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all border-4 ${
              selectedCategoryIndex === 0 ? 'bg-red-600 text-yellow-200 border-red-600 shadow-2xl' : 'text-rose-900 border-rose-900/10 hover:border-red-600'
            }`}
          >
            {allCategory}
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx + 1}
              onClick={() => setSelectedCategoryIndex(idx + 1)}
              className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all border-4 ${
                selectedCategoryIndex === idx + 1 ? 'bg-red-600 text-yellow-200 border-red-600 shadow-2xl' : 'text-rose-900 border-rose-900/10 hover:border-red-600'
              }`}
            >
              {getText(cat)}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
          {filteredImages.map((image, index) => {
            // Distribute grid spans for masonry effect
            const spans = [
              'lg:col-span-2 lg:row-span-2', // Large
              'lg:col-span-1 lg:row-span-1', // Regular
              'lg:col-span-1 lg:row-span-2', // Tall
              'lg:col-span-1 lg:row-span-1', // Regular
              'lg:col-span-1 lg:row-span-1', // Regular
              'lg:col-span-2 lg:row-span-1', // Wide
            ];
            const spanClass = spans[index % spans.length];

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                className={`relative cursor-pointer group rounded-[3rem] overflow-hidden shadow-xl ${spanClass}`}
              >
                <img
                  src={image.url}
                  alt={getText(image.caption)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-yellow-200 font-black text-2xl tracking-tighter italic">{getText(image.caption)}</p>
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
