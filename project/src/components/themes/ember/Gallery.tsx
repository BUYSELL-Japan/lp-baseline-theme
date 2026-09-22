import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';
import Lightbox from '../../Lightbox';
import SectionError from '../../SectionError';

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

  useEffect(() => { setSelectedCategoryIndex(0); }, [language]);

  if (!galleryData) return <SectionError sectionName="Gallery" error="No gallery data available" data={galleryData} />;
  if (!galleryData.images || !Array.isArray(galleryData.images)) {
    return <SectionError sectionName="Gallery" error="No gallery images found." data={galleryData} />;
  }

  const categories = galleryData.categories && Array.isArray(galleryData.categories) ? galleryData.categories : [];
  const selectedCategoryObj = selectedCategoryIndex === 0 ? null : categories[selectedCategoryIndex - 1];
  const filteredImages = selectedCategoryIndex === 0
    ? galleryData.images
    : galleryData.images.filter(img => getText(img.category) === getText(selectedCategoryObj));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const itemWidth = el.offsetWidth * 0.85 + 16;
      setCurrentIndex(Math.round(el.scrollLeft / itemWidth));
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [selectedCategoryIndex]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
      scrollRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    }
  };

  const lightboxImages = filteredImages.map(img => ({ src: img.url, alt: getText(img.caption) }));
  const sectionTitle = getText(galleryData.sectionTitle);
  const sectionSubtitle = getText(galleryData.sectionSubtitle);
  if (!sectionTitle || galleryData.images.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-20 py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-[#141414]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#8B0000] mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-wide text-gray-100 mb-4 border-b-2 border-[#D4AF37] pb-4 inline-block">
            {sectionTitle}
          </h2>
          {sectionSubtitle && <p className="text-xl text-gray-200">{sectionSubtitle}</p>}
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <motion.button
            onClick={() => setSelectedCategoryIndex(0)}
            className={`px-6 py-2.5 rounded-xl font-serif font-bold tracking-wide text-sm uppercase tracking-widest transition-all ${
              selectedCategoryIndex === 0
                ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30'
                : 'bg-[#141414] text-gray-200 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-gray-100'
            }`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            {allCategory}
          </motion.button>
          {categories.map((category, idx) => {
            const categoryIndex = idx + 1;
            return (
              <motion.button
                key={categoryIndex}
                onClick={() => setSelectedCategoryIndex(categoryIndex)}
                className={`px-6 py-2.5 rounded-xl font-serif font-bold tracking-wide text-sm uppercase tracking-widest transition-all ${
                  selectedCategoryIndex === categoryIndex
                    ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/30'
                    : 'bg-[#141414] text-gray-200 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-gray-100'
                }`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {getText(category)}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Desktop grid */}
        <motion.div layout className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.url}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-lg transition-colors"
            >
              <div className="aspect-square bg-[#1a1a1a] relative overflow-hidden">
                <img src={image.url} alt={getText(image.caption)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-serif font-bold tracking-wide text-lg">{getText(image.caption)}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-[#8B0000] text-white text-xs font-serif font-bold uppercase tracking-widest rounded-lg">
                      {getText(image.category)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile scroll */}
        <div className="md:hidden w-full">
          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 gap-4 pb-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.url}-${index}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div className="group relative rounded-2xl overflow-hidden border border-[#D4AF37]/30">
                  <div className="aspect-square bg-[#1a1a1a] relative overflow-hidden">
                    <img src={image.url} alt={getText(image.caption)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white font-serif font-bold tracking-wide">{getText(image.caption)}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-[#8B0000] text-white text-xs font-serif font-bold tracking-wide uppercase rounded-lg">
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
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#8B0000] w-8' : 'bg-[#2a2a2a] w-2 hover:bg-[#333333]'}`}
                aria-label={`Image ${index + 1}`}
              />
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
      </div>
    </section>
  );
}
