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
    <section id="about" className="scroll-mt-20 py-32 md:py-48 bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-32 md:mb-48">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em]">
            {sectionTitle}
          </h2>
        </div>

        <div className="space-y-40 md:space-y-64">
          {aboutData.features.map((feature, index) => {
            const title = getLocalizedValue(feature, 'title', language);
            const desc = getLocalizedValue(feature, 'description', language);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center text-center"
              >
                {/* Circular Image with Gold Border */}
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[1px] border-[#B8960C] p-4 md:p-6 mb-16 md:mb-24">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#F5F0E8]">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={title || ''} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center">
                         <span className="text-[#1a1a1a] font-serif">Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="max-w-2xl mx-auto">
                  {title && (
                    <h3 className="text-2xl md:text-4xl font-serif text-[#1a1a1a] tracking-[0.15em] mb-12">
                      {title}
                    </h3>
                  )}
                  {desc && (
                    <div className="text-[#2D2D2D] font-sans font-light leading-[2.5] text-lg md:text-xl space-y-6 text-justify md:text-center">
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
