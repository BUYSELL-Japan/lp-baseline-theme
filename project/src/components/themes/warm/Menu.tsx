import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';
import Lightbox from '../../Lightbox';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!menuData) return <SectionError sectionName="Menu" error="No menu data available" data={menuData} />;

  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language);
  if (!sectionTitle) return <SectionError sectionName="Menu" error="Missing section title" data={menuData} />;

  if (!menuData.items || menuData.items.length === 0) {
    return <SectionError sectionName="Menu" error="No menu items found." data={menuData} />;
  }

  const itemsWithImages = menuData.items.filter((item) => item.image);
  const lightboxImages = itemsWithImages.map((item) => ({
    src: item.image,
    alt: getLocalizedValue(item, 'name', language) || '',
  }));

  return (
    <section id="menu" className="scroll-mt-20 py-20 bg-[#FFFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#92400E] inline-block relative">
            {sectionTitle}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#D97706] rounded-full"></span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {menuData.items.map((item, itemIndex) => {
            const itemName = getLocalizedValue(item, 'name', language);
            return (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: itemIndex * 0.05 }}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D97706]/20 hover:border-[#D97706]/50"
              >
                {item.image ? (
                  <div
                    className="aspect-square w-full overflow-hidden p-2 cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(itemsWithImages.indexOf(item));
                      setLightboxOpen(true);
                    }}
                  >
                    <img src={item.image} alt={itemName} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-[#FEF3C7] m-2 rounded-2xl flex items-center justify-center">
                    
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow justify-between bg-white text-center">
                  <div>
                    <h4 className="text-lg font-bold text-[#1C1917] mb-1 line-clamp-2">{itemName}</h4>
                    {item.description && (
                      <p className="text-sm text-[#1C1917] line-clamp-2 mb-3">{getLocalizedValue(item, 'description', language)}</p>
                    )}
                  </div>
                  <span className="text-lg font-black text-[#D97706]">
                    {item.price}
                  </span>
                </div>
              </motion.div>
            );
          })}
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
