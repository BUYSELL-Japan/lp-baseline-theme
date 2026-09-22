import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();
  if (!aboutData || (!aboutData.sectionTitle && (!aboutData.features || aboutData.features.length === 0))) return null;

  const title = getLocalizedValue(aboutData, 'sectionTitle', language);

  return (
    <section id="about" className="scroll-mt-20 py-20 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        {title && (
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-8 border-l-8 border-[#DC2626] pl-6 text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#F59E0B]">
            {title}
          </h2>
        )}
      </div>

      <div className="flex flex-col">
        {aboutData.features?.map((feature, index) => {
          const featTitle = getLocalizedValue(feature, 'title', language);
          const featDesc = getLocalizedValue(feature, 'description', language);
          const isDarker = index % 2 === 1;

          return (
            <div key={index} className={`w-full ${isDarker ? 'bg-[#171717]' : 'bg-[#0a0a0a]'} py-16 lg:py-24`}>
              <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                  <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white skew-x-[-5deg]">
                    <span className="text-[#DC2626] mr-4 text-5xl">0{index + 1}</span>
                    {featTitle}
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed font-bold">
                    {featDesc}
                  </p>
                </div>
                {feature.image && (
                  <div className="w-full lg:w-1/2 order-1 lg:order-2">
                    <div 
                      className="w-full h-64 sm:h-96 bg-cover bg-center shadow-[15px_15px_0_0_#DC2626]"
                      style={{ 
                        backgroundImage: `url(${feature.image})`,
                        clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
