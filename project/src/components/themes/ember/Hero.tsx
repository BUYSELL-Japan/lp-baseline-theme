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
    <section 
      className="relative min-h-[90svh] sm:min-h-screen flex items-end sm:items-center bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
    >
      {/* Dark overlay for Ember's heavy feel (60% opacity) */}
      <div className="absolute inset-0 bg-[#0a0a0a]/60 z-0"></div>
      
      {/* Additional gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent hidden sm:block z-0"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-20 sm:pb-0 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight mb-8 break-words">
            {title}
          </h1>
          
          {/* Gold Underline */}
          <div className="w-24 h-1 bg-[#D4AF37] mb-8 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-10 font-sans font-medium">
            {subtitle}
          </p>
          
          {/* Crimson Button */}
          <a
            href="#menu"
            className="inline-block bg-[#8B0000] hover:bg-[#C0392B] text-white px-10 py-4 text-lg font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(139,0,0,0.5)] border border-[#D4AF37]/50"
          >
            メニューを見る
          </a>
        </motion.div>
      </div>
    </section>
  );
}
