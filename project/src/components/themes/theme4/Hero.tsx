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
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-amber-50 flex items-center">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-yellow-400 opacity-20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-red-600 opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-30 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <h1 className="text-[12vw] lg:text-[10rem] font-black leading-[0.8] mb-12 tracking-tighter italic text-rose-950">
                {String(title).split('\n').map((line: string, i: number) => (
                  <motion.span 
                    key={i} 
                    className="block even:text-red-600 even:pl-[0.5em] lg:even:pl-[1em]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.8 }}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="w-32 h-4 bg-yellow-400 mb-12 origin-left rounded-full"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-2xl md:text-4xl font-black text-orange-900/60 max-w-xl leading-tight mb-12"
              >
                {String(subtitle)}
              </motion.p>

              {/* Action Indicator (Minimal) */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center animate-bounce">
                  <ChevronDown className="text-red-600 w-6 h-6" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image - Right Side (Overlapping) */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 5 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="relative z-10"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[4rem] shadow-[0_40px_100px_rgba(220,38,38,0.2)] border-8 border-white p-2 bg-white">
                <motion.img
                  style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '20%']) }}
                  src={heroData.backgroundImage}
                  alt="Hero"
                  className="w-full h-full object-cover rounded-[3.5rem]"
                />
              </div>

              {/* Decorative Sun Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-12 -right-12 z-20"
              >
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
                  <Sun className="w-16 h-16 text-white" />
                </div>
              </motion.div>
            </motion.div>

            {/* Back Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-4 border-red-200 border-dashed rounded-full -z-10 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Wave Divider (Optional - keep but subtle) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-40 transform translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-amber-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.23,103.19,114.37,112.98,172,111,111.47,111,238.47,71.88,321.39,56.44Z" className="opacity-30"></path>
        </svg>
      </div>
    </div>
  );
}
