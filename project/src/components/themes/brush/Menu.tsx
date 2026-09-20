import React from 'react';
import { motion } from 'framer-motion';

import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();
  const { getText } = useLocalize();

  if (!menuData || !menuData.categories) return null;

  const allItems = menuData.categories.flatMap(c => c.items);
  // Optional: Just show all items flat or by category. We'll show all items flat for "一品入魂" impact.

  return (
    <section id="menu" className="w-full bg-[#F5F0E8] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-serif font-black tracking-tight text-[#1a1a1a] mb-6"
        >
          {getText(menuData.sectionTitle)}
        </motion.h2>
        <div className="w-24 h-2 bg-[#C0392B] mx-auto mb-6" />
        <p className="text-xl md:text-2xl font-serif font-bold text-[#1a1a1a] tracking-widest">
          {getText(menuData.sectionSubtitle)}
        </p>
      </div>

      <div className="w-full flex flex-col">
        {allItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full border-t border-b border-[#1a1a1a]/20 -mt-px flex flex-col md:flex-row group"
          >
            {/* Left Image */}
            <div className="w-full md:w-[40%] aspect-[4/3] md:aspect-auto md:h-auto relative overflow-hidden">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={getText(item.name)} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a]/10 flex items-center justify-center font-serif text-[#1a1a1a]/40 text-xl">
                  No Image
                </div>
              )}
            </div>

            {/* Right Text */}
            <div className="w-full md:w-[60%] p-10 md:p-16 lg:p-24 flex flex-col justify-center bg-[#F5F0E8]">
              {item.badge && (
                <div className="mb-6">
                  <span className="inline-block bg-[#1a1a1a] text-white px-4 py-1 text-sm font-sans font-bold tracking-widest">
                    {getText(item.badge)}
                  </span>
                </div>
              )}
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#1a1a1a] tracking-tight mb-8 leading-tight">
                {getText(item.name)}
              </h3>
              
              {item.description && (
                <p className="text-lg md:text-xl font-sans text-[#1a1a1a]/80 leading-relaxed mb-10 max-w-2xl">
                  {getText(item.description)}
                </p>
              )}
              
              <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#C0392B] tracking-widest mt-auto">
                {getText(item.price)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
