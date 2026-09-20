import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();

  if (!heroData) return null;

  const title = getLocalizedValue(heroData, 'title', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);

  if (!title && !subtitle && !heroData.backgroundImage) return null;

  return (
    <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FFFBF0]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(146,64,14,0.1)] overflow-hidden flex flex-col md:flex-row relative border-4 border-[#FEF3C7]"
        >
          {/* Lantern glow effect */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D97706] rounded-full blur-[100px] opacity-20 pointer-events-none" />

          {heroData.backgroundImage && (
            <div className="w-full md:w-1/2 h-64 md:h-[450px] relative">
              <img 
                src={heroData.backgroundImage} 
                alt={title || 'Hero'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1C1917] leading-tight mb-6">
              {title}
            </h1>
            <div className="w-16 h-2 bg-[#D97706] rounded-full mb-8" />
            <a
              href="#menu"
              className="inline-block bg-[#92400E] hover:bg-[#D97706] text-white px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 shadow-md self-start text-center"
            >
              メニューを見る
            </a>
          </div>
        </motion.div>

        {subtitle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-[#FEF3C7] rounded-full px-6 py-4 flex items-center justify-center shadow-sm border border-[#D97706]/20 mx-auto max-w-max"
          >
            <span className="text-[#D97706] mr-3 font-black text-2xl leading-none"></span>
            <p className="text-[#92400E] font-bold text-lg">{subtitle}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
