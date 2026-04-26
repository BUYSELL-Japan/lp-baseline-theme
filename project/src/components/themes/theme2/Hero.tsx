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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Background with modern overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroData.backgroundImage} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-10 font-medium">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modern abstract elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
