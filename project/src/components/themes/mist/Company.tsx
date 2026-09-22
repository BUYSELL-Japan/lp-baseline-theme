import React from 'react';
import { motion } from 'framer-motion';
import { useCompanyData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Company() {
  const companyData = useCompanyData();
  const { language } = useLanguage();

  if (!companyData) return <SectionError sectionName="Company" error="No company data available" />;
  const sectionTitle = getLocalizedValue(companyData, 'sectionTitle', language);

  return (
    <section id="company" className="scroll-mt-20 bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
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

        {companyData.philosophy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-32 w-full"
          >
            <h3 className="text-sm font-sans font-medium text-[#444444] mb-8 tracking-[0.15em]">
              {getLocalizedValue(companyData.philosophy, 'title', language)}
            </h3>
            <p className="text-[#888888] font-light text-sm leading-loose tracking-widest whitespace-pre-line">
              {getLocalizedValue(companyData.philosophy, 'content', language)}
            </p>
          </motion.div>
        )}

        {companyData.companyInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-sm font-sans font-medium text-[#444444] mb-12 tracking-[0.15em] text-center">
              {getLocalizedValue(companyData.companyInfo, 'title', language)}
            </h3>
            <div className="border-t border-[#EEEEEE]">
              {companyData.companyInfo.items?.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row py-6 border-b border-[#EEEEEE] text-xs md:text-sm tracking-widest">
                  <div className="w-full sm:w-1/3 text-[#444444] mb-2 sm:mb-0 font-medium">
                    {getLocalizedValue(item, 'label', language)}
                  </div>
                  <div className="w-full sm:w-2/3 text-[#888888] font-light">
                    {getLocalizedValue(item, 'value', language)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
