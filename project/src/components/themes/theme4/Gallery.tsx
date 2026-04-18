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
    <section id="gallery" className="py-32 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Visual Paradise</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-yellow-400 mx-auto rounded-full" />
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <button
            onClick={() => setSelectedCategoryIndex(0)}
            className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all border-2 ${
              selectedCategoryIndex === 0 ? 'bg-red-600 text-yellow-200 border-red-600 shadow-lg' : 'text-rose-900 border-rose-900/10 hover:border-red-600'
            }`}
          >
            {allCategory}
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx + 1}
              onClick={() => setSelectedCategoryIndex(idx + 1)}
              className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all border-2 ${
                selectedCategoryIndex === idx + 1 ? 'bg-red-600 text-yellow-200 border-red-600 shadow-lg' : 'text-rose-900 border-rose-900/10 hover:border-red-600'
              }`}
            >
              {getText(cat)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredImages.map((image, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              className="relative aspect-square cursor-pointer group rounded-[3rem] overflow-hidden p-2 bg-white shadow-[0_15px_40px_rgba(239,68,68,0.08)]"
            >
              <div className="w-full h-full rounded-[2.8rem] overflow-hidden relative">
                <img
                  src={image.url}
                  alt={getText(image.caption)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-yellow-200 font-black text-2xl tracking-tighter italic">{getText(image.caption)}</p>
                    <span className="inline-block mt-3 px-4 py-1 bg-yellow-400 text-rose-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {getText(image.category)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
