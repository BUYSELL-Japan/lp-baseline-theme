import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown, Sun } from 'lucide-react';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  if (!heroData) return null;

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  let title = getLocalizedValue(heroData, 'sectionTitle', language) || getLocalizedValue(heroData, 'title', language);
  let subtitle = getLocalizedValue(heroData, 'sectionSubtitle', language) || getLocalizedValue(heroData, 'subtitle', language);

  if (typeof title === 'object') {
    title = title[language] || title['ja'] || '';
  }
  if (typeof subtitle === 'object') {
    subtitle = subtitle[language] || subtitle['ja'] || '';
  }

  return (
    <div ref={ref} className="relative h-[110vh] overflow-hidden bg-amber-50">
      {/* Background with Parallax and Gradient Overlay */}
      <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full">
        {/* Colorful Tropical Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/60 via-orange-500/40 to-red-600/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-50 z-20" />
        <img
          src={heroData.backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Tropical Decorative Elements */}
      <motion.div 
        className="absolute top-1/4 right-10 z-30 opacity-20 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <Sun className="w-64 h-64 text-yellow-300" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-30 h-full flex flex-col items-center justify-center text-rose-900 px-6 pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block px-4 py-1 mb-6 rounded-full bg-red-600 text-yellow-200 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/30"
          >
            Welcome to Paradise
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter italic">
            {String(title).split('\n').map((line: string, i: number) => (
              <span key={i} className="block last:text-red-600 last:drop-shadow-[0_4px_10px_rgba(220,38,38,0.5)]">
                {line}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-3xl font-bold text-orange-800/80 max-w-2xl mx-auto leading-relaxed"
          >
            {String(subtitle)}
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-16 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-black uppercase tracking-widest text-red-600 animate-pulse">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="p-3 bg-red-600 rounded-full shadow-lg shadow-red-500/40"
          >
            <ChevronDown className="w-6 h-6 text-yellow-200" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Wave Bottom Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-40 transform translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-amber-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.23,103.19,114.37,112.98,172,111cf,111.47,111,238.47,71.88,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
}
