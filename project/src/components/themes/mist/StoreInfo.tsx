import React from 'react';
import { motion } from 'framer-motion';
import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { language } = useLanguage();

  if (!storeInfoData) return <SectionError sectionName="StoreInfo" error="No store info available" />;
  const sectionTitle = getLocalizedValue(storeInfoData, 'sectionTitle', language);

  return (
    <section id="storeInfo" className="scroll-mt-20 bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="w-full border-t border-[#EEEEEE]">
          {storeInfoData.items?.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row py-8 border-b border-[#EEEEEE] text-xs md:text-sm tracking-widest gap-2 sm:gap-6">
              <div className="w-full sm:w-1/3 text-[#444444] font-medium pt-1">
                {getLocalizedValue(item, 'title', language)}
              </div>
              <div className="w-full sm:w-2/3 text-[#888888] font-light leading-loose whitespace-pre-line">
                {getLocalizedValue(item, 'content', language)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
