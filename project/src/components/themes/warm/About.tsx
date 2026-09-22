import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();
  
  if (!aboutData) return <SectionError sectionName="About" error="No about data available" data={aboutData} />;
  
  const sectionTitle = getLocalizedValue(aboutData, 'sectionTitle', language);
  if (!sectionTitle) return <SectionError sectionName="About" error="Missing section title" data={aboutData} />;

  if (!aboutData.features || !Array.isArray(aboutData.features) || aboutData.features.length === 0) {
    return <SectionError sectionName="About" error="Missing about features data" data={aboutData} />;
  }

  return (
    <section id="about" className="scroll-mt-20 py-24 bg-[#FEF3C7]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#92400E] mb-6 inline-block relative">
            {sectionTitle}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#D97706] rounded-full"></span>
          </h2>
        </div>

        <div className="space-y-24">
          {aboutData.features.map((feature, index) => {
            const title = getLocalizedValue(feature, 'title', language);
            const desc = getLocalizedValue(feature, 'description', language);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Circular Image */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-10">
                  <div className="absolute inset-0 bg-[#D97706]/10 rounded-full transform translate-x-3 translate-y-3"></div>
                  {feature.image ? (
                    <img 
                      src={feature.image} 
                      alt={title || ''} 
                      className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-[#92400E] font-bold">Image</span>
                    </div>
                  )}
                  {/* Decorative element */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#92400E] rounded-full opacity-20"></div>
                </div>

                {/* Text Content */}
                <div className="max-w-2xl mx-auto">
                  {title && (
                    <h3 className="text-3xl font-bold text-[#92400E] mb-6 tracking-wide">
                      {title}
                    </h3>
                  )}
                  {desc && (
                    <div className="text-[#1C1917] font-medium leading-loose text-lg space-y-4">
                      {desc.split('\n').map((paragraph: string, pIndex: number) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
