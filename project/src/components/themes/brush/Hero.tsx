import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData, useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Hero() {
  const heroData = useHeroData();
  const storeInfo = useStoreInfoData();
  const { language } = useLanguage();

  if (!heroData) return <SectionError sectionName="Hero" error="No hero data available" data={heroData} />;

  const title = getLocalizedValue(heroData, 'sectionTitle', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);
  const storeName = storeInfo ? getLocalizedValue(storeInfo, 'name', language) : '';

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      
      {/* Background Image with Overlay */}
      {heroData.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={heroData.backgroundImage} 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      <div className="relative z-10 px-6 text-center w-full flex flex-col items-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {storeName && (
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-4xl font-serif font-black text-white drop-shadow-lg mb-8 tracking-widest"
            >
              {storeName}
            </motion.h1>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center mb-10"
          >
            <h2 className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] font-serif font-black text-white tracking-tighter drop-shadow-xl leading-tight whitespace-pre-line text-center">
              {title}
            </h2>
            <div className="w-3/4 max-w-sm h-3 md:h-4 bg-[#C0392B] mt-4 shadow-lg rounded-sm"></div>
          </motion.div>
          
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-2xl lg:text-3xl font-serif font-bold text-white drop-shadow-md mb-12 tracking-wide whitespace-pre-line text-center"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.a 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            href="#menu" 
            className="bg-[#C0392B] text-white font-sans font-black px-12 py-5 text-xl md:text-2xl shadow-xl hover:bg-[#A93226] transition-colors"
          >
            {translate('viewMenu', language)}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
