import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData, useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Hero() {
  const heroData = useHeroData();
  const storeInfo = useStoreInfoData();
  const { language } = useLanguage();

  if (!heroData) return <SectionError sectionName="Hero" error="No hero data available" data={heroData} />;

  const title = getLocalizedValue(heroData, 'title', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);
  const storeName = storeInfo ? getLocalizedValue(storeInfo, 'name', language) : '';

  if (!title) return <SectionError sectionName="Hero" error="Missing title" data={heroData} />;

  return (
    <section id="hero" className="relative w-full min-h-screen bg-[#FFFFFF] flex flex-col md:flex-row overflow-hidden">
      
      {/* PC Text Area (Right 30%) & Mobile Text Area (Top) */}
      <div className="w-full md:w-[30%] order-2 md:order-2 flex flex-col justify-center items-center py-20 px-8 md:px-12 md:py-32 bg-[#FFFFFF] z-10 md:min-h-screen border-l border-[#F5F0E8]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex flex-col items-center gap-8 md:gap-0 md:block md:[writing-mode:vertical-rl] md:h-full md:max-h-[70vh]"
        >
          {storeName && (
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#1a1a1a] tracking-[0.3em] leading-loose whitespace-nowrap md:ml-12 lg:ml-20">
              {storeName}
            </h1>
          )}
          <div className="flex flex-col items-center gap-4 md:block md:mt-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#1a1a1a] tracking-[0.3em] leading-[2.5] md:ml-8 lg:ml-12">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg md:text-xl font-serif text-[#C0392B] tracking-[0.2em] leading-loose mt-6 md:mt-0 md:ml-4">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Image Area (Left 70%) */}
      <div className="w-full md:w-[70%] h-[60vh] md:h-screen order-1 md:order-1 relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          {heroData.backgroundImage ? (
            <img 
              src={heroData.backgroundImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center">
              <span className="text-[#1a1a1a] font-serif">Image</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
