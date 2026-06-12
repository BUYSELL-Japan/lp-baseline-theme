import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  let title = getLocalizedValue(heroData, 'sectionTitle', language) || getLocalizedValue(heroData, 'title', language);
  let subtitle = getLocalizedValue(heroData, 'sectionSubtitle', language) || getLocalizedValue(heroData, 'subtitle', language);

  if (typeof title === 'object') {
    title = title[language] || title['ja'] || '';
  }
  if (typeof subtitle === 'object') {
    subtitle = subtitle[language] || subtitle['ja'] || '';
  }

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-gray-100 flex items-center">

      {/* Concrete texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.3) 2px,
            rgba(0,0,0,0.3) 4px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 8px,
            rgba(0,0,0,0.1) 8px,
            rgba(0,0,0,0.1) 16px
          )`
        }}
      />

      {/* Red noren accent — vertical bar left */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C0392B]" />

      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-20 pt-28 lg:pt-20 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-0 min-h-[80vh]">

          {/* Text Block - overlaps image on desktop */}
          <motion.div
            className="w-full lg:w-1/2 order-2 lg:order-1 z-20 relative lg:-mr-16"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Cymbal-disc gold circle decoration */}
            <div className="hidden lg:block absolute -top-16 -left-8 w-28 h-28 border-[6px] border-[#D4AF37]/40 rounded-full z-0" />
            <div className="hidden lg:block absolute -top-8 -left-0 w-14 h-14 border-[3px] border-[#D4AF37]/60 rounded-full z-0" />

            <div className="bg-white border border-gray-200 px-10 py-12 lg:py-16 relative z-10">
              {/* Gold top accent line */}
              <div className="w-12 h-0.5 bg-[#D4AF37] mb-8" />

              <h1 className="text-[11vw] lg:text-[5.5rem] font-black leading-[0.88] mb-8 tracking-tight text-gray-900">
                {String(title).split('\n').map((line: string, i: number) => (
                  <motion.span
                    key={i}
                    className="block"
                    style={{ color: i === 1 ? '#C0392B' : '#1a1a1a' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.12), duration: 0.6 }}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#D4AF37]" />
                <div className="w-2 h-2 rounded-full border border-[#D4AF37]" />
                <div className="w-16 h-px bg-gray-200" />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-base lg:text-lg font-medium text-gray-600 max-w-sm leading-relaxed"
              >
                {String(subtitle)}
              </motion.p>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-10 flex items-center gap-3"
              >
                <div className="w-px h-10 bg-gray-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Scroll</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Image - Right, slightly tilted */}
          <div className="w-full lg:w-[55%] order-1 lg:order-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              {/* Red noren accent top-right */}
              <div className="absolute -top-3 right-8 w-0.5 h-16 bg-[#C0392B] z-10" />
              <div className="absolute -top-3 right-14 w-0.5 h-10 bg-[#C0392B]/50 z-10" />

              <div className="aspect-[4/3] lg:aspect-[3/2] overflow-hidden bg-white/50 flex items-center justify-center">
                <motion.img
                  src={heroData.backgroundImage}
                  alt="Hero"
                  className="w-full h-full object-contain object-center"
                />
              </div>

              {/* Gold line frame accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
              <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-[#D4AF37]" />

              {/* Cymbal disc gold circle - decorative, industrial music element */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-8 -right-8 w-24 h-24 lg:w-32 lg:h-32 rounded-full border-[5px] border-[#D4AF37]/50 hidden lg:flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-[#D4AF37]/60" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
    </div>
  );
}
