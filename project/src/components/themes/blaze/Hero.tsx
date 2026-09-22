import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();

  if (!heroData) return null;

  const title = getLocalizedValue(heroData, 'title', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);

  if (!title && !subtitle && !heroData.backgroundImage) return null;

  return (
    <section className="relative min-h-[90svh] sm:min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center">
      <style>{`
        .blaze-clip {
          clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 100%);
        }
        @media (min-width: 1024px) {
          .blaze-clip {
            clip-path: polygon(40% 0, 100% 0, 100% 100%, 0 100%);
          }
        }
      `}</style>
      
      {/* Background Image with diagonal clip-path */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center blaze-clip z-0"
        style={heroData.backgroundImage ? { backgroundImage: `url(${heroData.backgroundImage})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#EA580C]/50 to-[#DC2626]/30 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="max-w-2xl w-full lg:w-1/2 pt-20 lg:pt-0"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-sans font-black tracking-tighter text-white leading-none mb-6 break-words uppercase italic">
            {title}
          </h1>
          
          <div className="w-32 h-2 bg-gradient-to-r from-[#DC2626] to-[#F59E0B] mb-6 skew-x-[-15deg]" />
          
          <p className="text-xl sm:text-2xl text-gray-200 leading-tight mb-10 font-sans font-bold tracking-tight bg-[#0a0a0a]/70 inline-block p-3 rounded-lg border-l-4 border-[#EA580C]">
            {subtitle}
          </p>
          <br/>
          
          <a
            href="#menu"
            className="inline-block bg-[#DC2626] hover:bg-[#EA580C] text-white px-12 py-5 text-xl font-black transition-all duration-300 shadow-[8px_8px_0_0_#F59E0B] hover:shadow-[12px_12px_0_0_#F59E0B] hover:-translate-y-1 hover:-translate-x-1 skew-x-[-10deg] uppercase border-2 border-[#DC2626]"
          >
            <span className="inline-block skew-x-[10deg]">{translate('viewMenu', language)}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
