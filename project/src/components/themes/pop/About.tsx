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

  if (!aboutData.features || aboutData.features.length === 0) {
    return <SectionError sectionName="About" error="Missing about features data" data={aboutData} />;
  }

  return (
    <section id="about" className="scroll-mt-20 relative py-24 md:py-32 bg-[#FFBE0B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-block bg-[#1a1a1a] text-white px-8 py-3 rounded-full rotate-[-2deg] mb-4"
          >
            <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tight">
              {sectionTitle}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutData.features.map((feature, index) => {
            const title = getLocalizedValue(feature, 'title', language);
            const desc = getLocalizedValue(feature, 'description', language);
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[#FFFFFF] border-4 border-[#1a1a1a] rounded-[24px] p-6 shadow-[8px_8px_0_0_#1a1a1a] flex flex-col h-full"
              >
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border-2 border-[#1a1a1a]">
                  {feature.image ? (
                    <img 
                      src={feature.image} 
                      alt={title || ''} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#8ECAE6]"></div>
                  )}
                </div>

                <div className="flex-grow">
                  {title && (
                    <h3 className="text-2xl font-black text-[#1a1a1a] mb-4 leading-tight">
                      {title}
                    </h3>
                  )}
                  {desc && (
                    <div className="text-[#1a1a1a] font-bold text-base space-y-4">
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
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,113.88,192.5,93.4,242.69,76.75,286.9,62.83,321.39,56.44Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>
  );
}
