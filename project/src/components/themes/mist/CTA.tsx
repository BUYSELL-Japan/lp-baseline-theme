import React from 'react';
import { motion } from 'framer-motion';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function CTA() {
  const ctaData = useCTAData();
  const { language } = useLanguage();

  if (!ctaData) return <SectionError sectionName="CTA" error="No CTA data available" />;

  const title = getLocalizedValue(ctaData, 'sectionTitle', language);
  const description = getLocalizedValue(ctaData, 'description', language);

  return (
    <section id="cta" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-sans font-medium text-[#222222] mb-8 tracking-[0.15em]">
            {title}
          </h2>
          
          <p className="text-[#888888] font-light text-sm mb-16 tracking-widest leading-loose">
            {description}
          </p>
          
          {ctaData.buttons && ctaData.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {ctaData.buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href={getLocalizedValue(btn, 'link', language)}
                  className="inline-block border border-[#6B8F71] text-[#6B8F71] font-sans font-light px-12 py-3 hover:bg-[#6B8F71] hover:text-white transition-colors duration-500 text-xs md:text-sm tracking-[0.1em]"
                >
                  {getLocalizedValue(btn, 'text', language)}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
