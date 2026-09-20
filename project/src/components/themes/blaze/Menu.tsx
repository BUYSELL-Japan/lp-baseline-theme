import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import Lightbox from '../../Lightbox';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  if (!menuData || !menuData.items || menuData.items.length === 0) return null;
  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language) || 'Menu';

  const itemsWithImages = menuData.items.filter((item) => item.image);
  const lightboxImages: { src: string; alt: string }[] = itemsWithImages.map((item) => ({
    src: item.image,
    alt: getLocalizedValue(item, 'name', language) || '',
  }));

  return (
    <section id="menu" className="py-24 bg-[#0a0a0a] text-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#F59E0B]">
            {sectionTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-12">
          {menuData.items.map((item, itemIndex) => {
            const itemName = getLocalizedValue(item, 'name', language);
            const itemDesc = getLocalizedValue(item, 'description', language);
            const isEven = itemIndex % 2 === 0;
            return (
              <div
                key={itemIndex}
                className={`group relative bg-[#111] transition-all duration-300 hover:z-50 hover:-translate-y-4 shadow-[10px_10px_0_0_#DC2626] hover:shadow-[15px_15px_0_0_#F59E0B] border-2 border-gray-800 rounded-none lg:-mt-16 ${isEven ? 'lg:mt-0' : 'lg:mt-16'}`}
              >
                {item.image && (
                  <div
                    className="h-64 sm:h-80 w-full overflow-hidden cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(itemsWithImages.indexOf(item));
                      setLightboxOpen(true);
                    }}
                  >
                    <img src={item.image} alt={itemName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" />
                  </div>
                )}
                <div className="p-8 bg-[#111]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <h4 className="text-2xl sm:text-3xl font-black tracking-tight">{itemName}</h4>
                    <span className="text-3xl font-black text-[#F59E0B]">
                      {item.price}
                    </span>
                  </div>
                  {itemDesc && (
                    <p className="text-gray-400 font-bold leading-relaxed">{itemDesc}</p>
                  )}
                </div>
              </div>
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
