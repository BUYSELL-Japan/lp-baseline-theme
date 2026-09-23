import React from 'react';
import { motion } from 'framer-motion';
import { useHeroData, useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Hero() {
  const heroData = useHeroData();
  const storeInfo = useStoreInfoData();
  const { language } = useLanguage();

  if (!heroData) return <SectionError sectionName="Hero" error="No hero data available" data={heroData} />;

  const title = getLocalizedValue(heroData, 'sectionTitle', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);
  const storeName = storeInfo ? getLocalizedValue(storeInfo, 'name', language) : '';

  const bounceVariants: any = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
        bounce: 0.6,
      }
    }
  };

  const floatingCircles = [
    { size: 100, top: '25%', left: '85%', duration: 4, delay: 0 },
    { size: 200, top: '65%', left: '70%', duration: 4.5, delay: 1 },
    { size: 50, top: '80%', left: '20%', duration: 3.8, delay: 2 },
    { size: 150, top: '15%', left: '10%', duration: 5, delay: 0.5 },
    { size: 80, top: '50%', left: '15%', duration: 4.2, delay: 1.5 },
    { size: 120, top: '85%', left: '50%', duration: 5.5, delay: 2.5 },
    { size: 60, top: '10%', left: '45%', duration: 3.5, delay: 0.8 },
    { size: 90, top: '40%', left: '90%', duration: 4.8, delay: 1.2 },
  ];

  return (
    <section id="hero" className="relative w-full min-h-[90vh] md:min-h-screen bg-gradient-to-br from-[#FF006E] to-[#FB5607] flex flex-col justify-center items-center overflow-hidden pt-24 md:pt-0">
      
      {/* Floating Background Circles */}
      {floatingCircles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/30 rounded-full z-0"
          style={{
            width: circle.size,
            height: circle.size,
            top: circle.top,
            left: circle.left,
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: circle.delay
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 flex-grow pb-24 md:pb-32 pt-24 md:pt-16">
        {/* Left side: Text (Mobile: Bottom) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 w-full md:w-1/2"
        >
          {storeName && (
            <motion.h1 
              variants={bounceVariants}
              className="text-[4rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[7rem] font-sans font-black text-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)] mb-6 leading-[1.1]"
            >
              {storeName}
            </motion.h1>
          )}
          
          <motion.h2 
            variants={bounceVariants} 
            className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-sans font-black text-white tracking-tight drop-shadow-md leading-tight mb-8 whitespace-pre-line"
          >
            {title}
          </motion.h2>
          
          {subtitle && (
            <motion.p variants={bounceVariants} className="text-lg md:text-xl lg:text-2xl font-sans font-bold text-white drop-shadow-md leading-snug break-words max-w-full">
              {subtitle}
            </motion.p>
          )}

          <motion.a 
            variants={bounceVariants}
            href="#menu" 
            className="mt-10 bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white font-sans font-black px-10 py-5 rounded-full text-xl md:text-2xl shadow-xl hover:translate-y-1 hover:shadow-2xl transition-all"
          >
            {translate('viewMenu', language)}
          </motion.a>
        </motion.div>

        {/* Right side: Circular Image (Mobile: Top) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
          className="relative order-1 md:order-2 w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-10 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[300px] md:h-[300px] lg:w-[440px] lg:h-[440px] xl:w-[560px] xl:h-[560px] rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-white/20">
              {heroData.backgroundImage ? (
                <img 
                  src={heroData.backgroundImage} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-black">
                  Image Area
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* SVG Wave Divider at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
        <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,113.88,192.5,93.4,242.69,76.75,286.9,62.83,321.39,56.44Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>
  );
}
