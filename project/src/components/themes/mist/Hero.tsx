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

  return (
    <section id="hero" className="bg-[#FFFFFF] pt-40 pb-32 md:pt-56 md:pb-48 px-6 md:px-12 border-b border-[#EEEEEE] flex flex-col items-center justify-center text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-4xl md:text-5xl font-sans font-medium text-[#222222] mb-6 tracking-[0.15em] whitespace-pre-line"
      >
        {title}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-sm md:text-base font-sans font-light text-[#888888] tracking-[0.2em] mb-16 whitespace-pre-line leading-loose"
      >
        {subtitle}
      </motion.p>
      
      <motion.a
        href="#contact"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="inline-block border border-[#6B8F71] text-[#6B8F71] font-sans font-light px-12 py-3 hover:bg-[#6B8F71] hover:text-white transition-colors duration-500 text-sm tracking-[0.1em]"
      >
        {translate('bookingContact', language)}
      </motion.a>
    </section>
  );
}
