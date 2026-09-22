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

  if (!menuData) return <SectionError sectionName="Menu" error="No menu data available" />;
  if (!menuData.items || menuData.items.length === 0) return <SectionError sectionName="Menu" error="No menu items found" />;

  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language);
  const sectionSubtitle = getLocalizedValue(menuData, 'sectionSubtitle', language);

  const itemsWithImages = menuData.items.filter((item) => item.image);
  const lightboxImages = itemsWithImages.map((item) => ({
    src: item.image,
    alt: getLocalizedValue(item, 'name', language) || '',
  }));

  return (
    <section id="menu" className="scroll-mt-20 bg-[#F8F8F8] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-base text-[#333333]">{sectionSubtitle}</p>
          )}
        </motion.div>

        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[#E5E5E5] rounded-none overflow-hidden"
          >
            {/* Category Header (Using sectionTitle to simulate category) */}
            <div className="bg-[#333333] px-6 py-4">
              <h3 className="text-xl font-sans font-bold text-white">
                {sectionTitle}
              </h3>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
              {menuData.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className={`flex items-center p-4 border-b border-[#E5E5E5] last:border-b-0 ${
                    itemIndex % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className={`w-[60px] h-[60px] flex-shrink-0 mr-4 bg-[#E5E5E5] rounded-none overflow-hidden border border-[#E5E5E5] ${item.image ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (!item.image) return;
                      setLightboxIndex(itemsWithImages.indexOf(item));
                      setLightboxOpen(true);
                    }}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-bold text-[#333333] text-lg mb-1 break-words">
                      {getLocalizedValue(item, 'name', language)}
                    </h4>
                    {item.description && (
                      <p className="text-[#333333] text-sm hidden sm:block break-words">
                        {getLocalizedValue(item, 'description', language)}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="ml-4 flex-shrink-0 text-right">
                    <span className="font-sans font-bold text-xl text-[#2D6A4F]">
                      {getLocalizedValue(item, 'price', language)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
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
