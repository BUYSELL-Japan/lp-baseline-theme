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

  if (!menuData.items || menuData.items.length === 0) {
    return <SectionError sectionName="Menu" error="No menu items found." data={menuData} />;
  }

  // Pre-generate pseudo-random rotations so they don't mismatch on hydration
  const rotations = [2, -3, 1, -2, 3, -1, 4, -4];

  const itemsWithImages = menuData.items.filter((item) => item.image);
  const lightboxImages = itemsWithImages.map((item) => ({
    src: item.image,
    alt: getLocalizedValue(item, 'name', language) || '',
  }));

  return (
    <section id="menu" className="relative py-24 md:py-32 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-[#1a1a1a] tracking-tight">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {menuData.items.map((item, index) => {
            const itemName = getLocalizedValue(item, 'name', language);
            const rot = rotations[index % rotations.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05, rotate: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{ rotate: `${rot}deg` }}
                className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-[#1a1a1a] flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div
                  className={`w-full h-[250px] relative overflow-hidden bg-[#FFBE0B]/20 ${item.image ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (!item.image) return;
                    setLightboxIndex(itemsWithImages.indexOf(item));
                    setLightboxOpen(true);
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Price Sticker */}
                  <div className="absolute bottom-4 right-4 bg-[#FF006E] text-white font-black text-2xl px-4 py-2 rounded-xl rotate-[-5deg] shadow-lg border-2 border-white">
                    {item.price}
                  </div>
                </div>
                
                {/* Text */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black text-[#1a1a1a] mb-3 leading-tight">
                    {itemName}
                  </h3>
                  {item.description && (
                    <p className="text-base text-[#1a1a1a]/80 font-bold leading-relaxed">
                      {getLocalizedValue(item, 'description', language)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SVG Zigzag Divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-full z-20">
        <svg className="relative block w-full h-[30px]" viewBox="0 0 1200 30" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L600,30 L1200,0 L1200,30 L0,30 Z" fill="#FFBE0B"></path>
        </svg>
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
