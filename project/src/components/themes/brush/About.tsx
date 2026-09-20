import React from 'react';
import { motion } from 'framer-motion';

import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();
  const { getText } = useLocalize();

  if (!aboutData || !aboutData.features) return null;

  return (
    <section id="about" className="py-24 md:py-32 bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6"
        >
          {getText(aboutData.sectionTitle)}
        </motion.h2>
        <div className="w-24 h-2 bg-[#C0392B] mx-auto mb-6" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col gap-24 md:gap-32">
        {aboutData.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col text-center md:text-left items-center md:items-start"
          >
            <h3 className="text-3xl md:text-5xl font-serif font-black text-[#C0392B] mb-8 tracking-wide">
              {getText(feature.title)}
            </h3>
            <p className="text-lg md:text-xl font-sans text-white/90 leading-loose max-w-4xl mx-auto md:mx-0">
              {getText(feature.description)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
