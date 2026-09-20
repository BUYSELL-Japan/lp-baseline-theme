import React from 'react';
import { motion } from 'framer-motion';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function CTA() {
  const ctaData = useCTAData();
  const { language } = useLanguage();

  if (!ctaData) return <SectionError sectionName="CTA" error="No CTA data available" data={ctaData} />;

  return (
    <section id="cta" className="bg-[#2D6A4F] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-white mb-6">
            {getLocalizedValue(ctaData, 'title', language)}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {getLocalizedValue(ctaData, 'description', language)}
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-[#2D6A4F] hover:bg-[#F8F8F8] px-12 py-4 font-sans font-bold text-lg transition-colors border border-white"
          >
            {translate('bookingContact', language)}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
