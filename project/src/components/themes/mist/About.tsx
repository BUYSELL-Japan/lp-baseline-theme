import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();

  if (!aboutData) return <SectionError sectionName="About" error="No about data available" />;

  const sectionTitle = getLocalizedValue(aboutData, 'sectionTitle', language);
  const features = aboutData.features || [];

  return (
    <section id="about" className="scroll-mt-20 bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="flex flex-col space-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h3 className="text-lg md:text-xl font-sans font-medium text-[#222222] mb-8 tracking-[0.1em]">
                {getLocalizedValue(feature, 'title', language)}
              </h3>
              <p className="text-[#888888] font-light text-sm md:text-base leading-loose tracking-widest whitespace-pre-line">
                {getLocalizedValue(feature, 'description', language)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
