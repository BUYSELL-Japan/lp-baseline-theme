import React from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();

  if (!menuData) return <SectionError sectionName="Menu" error="No menu data available" />;
  if (!menuData.items || menuData.items.length === 0) return <SectionError sectionName="Menu" error="No menu items found" />;

  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language);

  return (
    <section id="menu" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'メニュー'}
          </h2>
        </motion.div>

        <div className="w-full flex flex-col space-y-24">
          {menuData.items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center w-full"
            >
              {item.image ? (
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-8 border border-[#EEEEEE] shadow-sm">
                  <img src={item.image} alt="" className="w-full h-full object-cover grayscale-[20%]" />
                </div>
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-white mb-8 border border-[#EEEEEE]" />
              )}
              
              <h4 className="font-sans font-medium text-[#444444] text-base mb-3 tracking-[0.1em]">
                {getLocalizedValue(item, 'name', language)}
              </h4>
              
              {item.description && (
                <p className="text-[#888888] font-light text-sm mb-4 leading-relaxed max-w-md">
                  {getLocalizedValue(item, 'description', language)}
                </p>
              )}

              <span className="font-sans font-light text-sm text-[#6B8F71] tracking-widest">
                {getLocalizedValue(item, 'price', language)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
