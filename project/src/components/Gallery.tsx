import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useGalleryData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/i18n';
import Lightbox from './Lightbox';
import SectionError from './SectionError';

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

  useEffect(() => {
    setSelectedCategoryIndex(0);
  }, [language]);

  if (!galleryData) {
    return <SectionError sectionName="Gallery" error="No gallery data available" data={galleryData} />;
  }

  if (!galleryData.images || !Array.isArray(galleryData.images)) {
    return <SectionError sectionName="Gallery" error="No gallery images found. Expected 'images' array in data." data={galleryData} />;
  }

  const categories = galleryData.categories && Array.isArray(galleryData.categories)
    ? galleryData.categories
    : [];

  const selectedCategoryObj = selectedCategoryIndex === 0
    ? null
    : categories[selectedCategoryIndex - 1];

  const filteredImages = selectedCategoryIndex === 0
    ? galleryData.images
    : galleryData.images.filter(img => {
        const imgCategoryText = getText(img.category);
        const selectedCategoryText = getText(selectedCategoryObj);
        return imgCategoryText === selectedCategoryText;
      });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(index);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0 });
    }
  }, [selectedCategoryIndex]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  const lightboxImages = filteredImages.map((img) => ({
    src: img.url,
    alt: getText(img.caption),
  }));

  const sectionTitle = getText(galleryData.sectionTitle);
  const sectionSubtitle = getText(galleryData.sectionSubtitle);

  if (!sectionTitle || galleryData.images.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-2 bg-theme-divider mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600">{sectionSubtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <motion.button
            key={0}
            onClick={() => setSelectedCategoryIndex(0)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedCategoryIndex === 0
                ? 'bg-theme-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {allCategory}
          </motion.button>
          {categories.map((category, idx) => {
            const categoryText = getText(category);
            const categoryIndex = idx + 1;
            return (
              <motion.button
                key={categoryIndex}
                onClick={() => setSelectedCategoryIndex(categoryIndex)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategoryIndex === categoryIndex
                    ? 'bg-theme-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {categoryText}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          layout
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.url}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => openLightbox(index)}
              className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            >
              <div className="aspect-square bg-gray-200 relative overflow-hidden">
                <img
                  src={image.url}
                  alt={getText(image.caption)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white text-lg font-bold">{getText(image.caption)}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-theme-primary text-white text-sm rounded-full">
                      {getText(image.category)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="md:hidden -mx-4">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.url}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={getText(image.caption)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white text-lg font-bold">{getText(image.caption)}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-theme-primary text-white text-sm rounded-full">
                          {getText(image.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-theme-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${translate('image', language)} ${index + 1}${translate('showItem', language)}`}
              />
            ))}
          </div>
        </div>

        {lightboxOpen && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        )}
      </div>
    </section>
  );
}
