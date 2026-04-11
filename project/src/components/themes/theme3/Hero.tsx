import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Hero() {
  const heroData = useHeroData();
  const { t } = useLocalize();

  if (!heroData) return null;

  const title = t(heroData, 'title');
  const subtitle = t(heroData, 'subtitle');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image with soft warm overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroData.backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/45 via-stone-900/30 to-stone-900/70" />
      </div>

      {/* Centered elegant content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto pt-20">
        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="w-16 h-px bg-amber-300 mx-auto mb-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-light leading-tight tracking-wider mb-8"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          className="w-16 h-px bg-amber-300 mx-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-serif text-xl md:text-2xl text-white/70 tracking-widest font-light leading-relaxed max-w-2xl mx-auto mb-14"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-12 py-4 border border-white/60 text-white font-serif text-sm tracking-[0.25em] hover:bg-white hover:text-stone-900 transition-all duration-500"
          >
            {t(heroData.cta, 'text') || 'Discover'}
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-12 py-4 bg-amber-700/80 text-white font-serif text-sm tracking-[0.25em] hover:bg-amber-700 transition-all duration-500"
          >
            ご予約
          </a>
        </motion.div>
      </div>

      {/* Elegant scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span className="text-white/40 font-serif text-xs tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-white/30"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
