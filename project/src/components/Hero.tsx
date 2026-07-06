import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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

  if (!heroData) return null;

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  let title = getLocalizedValue(heroData, 'sectionTitle', language) || getLocalizedValue(heroData, 'title', language);
  let subtitle = getLocalizedValue(heroData, 'sectionSubtitle', language) || getLocalizedValue(heroData, 'subtitle', language);

  if (typeof title === 'object') {
    title = title[language] || title['ja'] || title[Object.keys(title)[0]] || '';
  }
  if (typeof subtitle === 'object') {
    subtitle = subtitle[language] || subtitle['ja'] || subtitle[Object.keys(subtitle)[0]] || '';
  }

  title = String(title || '');
  subtitle = String(subtitle || '');

  if (!title && !subtitle && !heroData.backgroundImage) return null;

  return (
    <div ref={ref} className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-auto lg:min-h-[100svh] flex items-end overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        {/* 高コントラストな単色スクリム。中央が薄く抜けるtheme3のグラデーションとは異なる構成 */}
        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <img
          src={heroData.backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* 左寄せレイアウト（theme3の中央寄せ構成との差別化） */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-16 sm:pb-20 lg:pb-24 pt-24 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl text-left"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '64px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-2 bg-theme-accent mb-6"
          />

          <h1
            className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.05] break-words"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {title.split('\n').map((line: string, i: number) => (
              <span key={i}>
                {line}
                {i < title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/90 text-base sm:text-xl md:text-2xl font-medium leading-relaxed"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
