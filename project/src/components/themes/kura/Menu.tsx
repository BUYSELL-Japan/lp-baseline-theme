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
    <section id="menu" className="scroll-mt-20 py-32 md:py-48 bg-[#FAFAF7]">
      <div className="w-full px-6 md:px-0">
        <div className="text-center mb-32 md:mb-48">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em]">
            {sectionTitle}
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48">
          {menuData.items.map((item, itemIndex) => {
            const itemName = getLocalizedValue(item, 'name', language);
            const isEven = itemIndex % 2 === 0;
            return (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-12 md:gap-0 w-full max-w-none`}
              >
                {/* Image */}
                <div
                  className={`w-full md:w-1/2 h-[300px] md:h-[400px] overflow-hidden ${item.image ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (!item.image) return;
                    setLightboxIndex(itemsWithImages.indexOf(item));
                    setLightboxOpen(true);
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F5F0E8]"></div>
                  )}
                </div>
                
                {/* Text */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-8">
                  <h3 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] tracking-widest mb-10">
                    {itemName}
                  </h3>
                  {item.description && (
                    <p className="text-lg text-[#2D2D2D] font-sans font-light leading-[2.5] mb-12">
                      {getLocalizedValue(item, 'description', language)}
                    </p>
                  )}
                  <div className="text-2xl font-serif text-[#C0392B] tracking-wider mt-auto">
                    {item.price}
                  </div>
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
