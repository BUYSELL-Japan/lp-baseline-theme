import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import Lightbox from '../../Lightbox';

export default function Menu() {
  const menuData = useMenuData();
  const { t } = useLocalize();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!menuData || !menuData.items || menuData.items.length === 0) return null;
  if (!t(menuData, 'sectionTitle')) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const itemsWithImages = menuData.items.filter((item) => item.image);
  const lightboxImages = itemsWithImages.map((item) => ({
    src: item.image,
    alt: t(item, 'name'),
  }));

  return (
    <section id="menu" className="scroll-mt-20 py-24 sm:py-32 px-4 sm:px-6 bg-[#141414] border-t border-[#D4AF37]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 border-b-2 border-[#D4AF37] pb-4 inline-block">
            {t(menuData, 'sectionTitle')}
          </h2>
          <p className="text-xl text-gray-400 font-sans max-w-2xl leading-relaxed">
            {t(menuData, 'sectionSubtitle')}
          </p>
        </motion.div>

        {/* Responsive Container: Horizontal Scroll on Mobile, Grid on PC */}
        <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-6 lg:gap-8 pb-12 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.5) }}
              className="group min-w-[280px] sm:min-w-[360px] lg:min-w-0 snap-center lg:snap-align-none shrink-0 lg:shrink flex flex-col bg-[#0a0a0a] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300"
            >
              {item.image && (
                <div
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(itemsWithImages.indexOf(item))}
                >
                  <img
                    src={item.image}
                    alt={t(item, 'name')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#0a0a0a]/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              )}
              
              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2">
                    {t(item, 'name')}
                  </h3>
                  <div className="w-12 h-[2px] bg-[#D4AF37] mb-4" />
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-sans line-clamp-3 mb-6">
                    {t(item, 'description')}
                  </p>
                </div>
                <div className="text-2xl font-serif font-bold text-[#D4AF37]">
                  {t(item, 'price', item.price)}
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
            onPrevious={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1))}
            onNext={() => setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0))}
          />
        )}
      </div>
    </section>
  );
}
