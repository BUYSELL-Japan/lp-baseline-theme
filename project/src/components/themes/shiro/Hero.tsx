import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();

  if (!heroData) return <SectionError sectionName="Hero" error="No hero data available" />;

  const title = getLocalizedValue(heroData, 'sectionTitle', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);

  const imageUrl = heroData.backgroundImage;

  return (
    <section id="hero" className="bg-[#FFFFFF] pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 border-b border-[#E5E5E5] flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col items-start justify-center md:pl-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[#333333] mb-6 leading-tight whitespace-pre-line"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-sans text-[#333333] mb-10 whitespace-pre-line"
          >
            {subtitle}
          </motion.p>
          
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-[#2D6A4F] text-white font-sans font-bold px-10 py-4 hover:bg-[#1b4332] transition-colors rounded-none text-lg"
          >
            {translate('bookingContact', language)}
          </motion.a>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[35%] flex justify-end">
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-[300px] relative rounded-lg overflow-hidden border border-[#E5E5E5]"
            >
              <img 
                src={imageUrl} 
                alt="Hero" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
