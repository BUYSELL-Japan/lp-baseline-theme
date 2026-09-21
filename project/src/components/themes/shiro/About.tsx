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
    <section id="about" className="bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-none p-4 flex flex-col xl:flex-row gap-4"
            >
              {feature.image && (
                <div className="w-full xl:w-1/3 aspect-square xl:aspect-auto xl:h-full min-h-[120px] flex-shrink-0 border border-[#E5E5E5] rounded-none overflow-hidden bg-[#F8F8F8]">
                  <img 
                    src={feature.image} 
                    alt=""
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-sans font-bold text-[#333333] mb-2">
                  {getLocalizedValue(feature, 'title', language)}
                </h3>
                <p className="text-sm text-[#333333] leading-relaxed">
                  {getLocalizedValue(feature, 'description', language)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
