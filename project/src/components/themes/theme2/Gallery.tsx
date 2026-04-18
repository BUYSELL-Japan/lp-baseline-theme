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
    <section id="gallery" className="py-32 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-blue-500 mb-8" />
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            {sectionTitle}
          </h2>
          {sectionSubtitle && <p className="text-xl text-slate-400">{sectionSubtitle}</p>}
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
            className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
              selectedCategoryIndex === 0
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-blue-500/50 hover:text-white'
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
                className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                  selectedCategoryIndex === categoryIndex
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-blue-500/50 hover:text-white'
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
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-blue-500/40 transition-colors"
            >
              <div className="aspect-square bg-slate-800 relative overflow-hidden">
                <img src={image.url} alt={getText(image.caption)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-black text-lg tracking-tighter">{getText(image.caption)}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg">
                      {getText(image.category)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile scroll */}
        <div className="md:hidden -mx-6">
          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 gap-4 pb-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.url}-${index}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div className="group relative rounded-2xl overflow-hidden border border-slate-800">
                  <div className="aspect-square bg-slate-800 relative overflow-hidden">
                    <img src={image.url} alt={getText(image.caption)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white font-black">{getText(image.caption)}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase rounded-lg">
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
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-500 w-8' : 'bg-slate-700 w-2 hover:bg-slate-500'}`}
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
