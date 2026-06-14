import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useHeroData } from '../contexts/PageDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedValue } from '../utils/i18n';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  (()=>{})('[Hero] heroData:', heroData);
  (()=>{})('[Hero] language:', language);

  if (!heroData) {
    (()=>{})('[Hero] No heroData, returning null');
    return null;
  }

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  let title = getLocalizedValue(heroData, 'sectionTitle', language) || getLocalizedValue(heroData, 'title', language);
  let subtitle = getLocalizedValue(heroData, 'sectionSubtitle', language) || getLocalizedValue(heroData, 'subtitle', language);

  (()=>{})('[Hero] Raw title:', title);
  (()=>{})('[Hero] Raw subtitle:', subtitle);

  if (typeof title === 'object') {
    title = title[language] || title['ja'] || title[Object.keys(title)[0]] || '';
  }
  if (typeof subtitle === 'object') {
    subtitle = subtitle[language] || subtitle['ja'] || subtitle[Object.keys(subtitle)[0]] || '';
  }

  title = String(title || '');
  subtitle = String(subtitle || '');

  (()=>{})('[Hero] Processed title:', title);
  (()=>{})('[Hero] Processed subtitle:', subtitle);
  (()=>{})('[Hero] backgroundImage:', heroData.backgroundImage);

  if (!title && !subtitle && !heroData.backgroundImage) {
    (()=>{})('[Hero] No content to display, returning null');
    return null;
  }

  return (
    <div ref={ref} className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-auto lg:min-h-[100svh] flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
        <img
          src={heroData.backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full flex flex-col items-center justify-center text-white px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-center pt-16 sm:pt-20 lg:pt-0"
        >
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 break-words"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {title.split('\n').map((line: string, i: number) => (
              <span key={i}>
                {line}
                {i < title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-base sm:text-xl md:text-2xl font-light tracking-wider px-2"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="h-1.5 bg-theme-accent mt-8 mb-4 rounded-full shadow-[0_0_10px_rgba(200,67,58,0.5)]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="relative mt-4 lg:absolute lg:mt-0 lg:bottom-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-12 h-12 text-theme-accent opacity-90 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
