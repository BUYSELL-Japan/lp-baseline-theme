import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();

  if (!heroData) return null;

  const title = getLocalizedValue(heroData, 'title', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);
  const ctaText = getLocalizedValue(heroData.cta, 'text', language);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Background with modern overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroData.backgroundImage} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-40 scale-105"
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
            <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-blue-600/30">
              Exclusive Experience
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-10 font-medium">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl shadow-blue-600/50 hover:bg-blue-500 transition-colors"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 bg-slate-900/80 backdrop-blur-md text-white border border-slate-700 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="mt-20 flex items-center gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              { label: 'Rating', value: '4.9/5.0' },
              { label: 'Followers', value: '12k+' },
              { label: 'Award', value: 'Best Choice' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modern abstract elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
