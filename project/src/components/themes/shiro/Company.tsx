import React from 'react';
import { motion } from 'framer-motion';

import { useCompanyData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function Company() {
  const companyData = useCompanyData();
  const { getText } = useLocalize();

  if (!companyData) return <SectionError sectionName="Company" error="No company data available" data={companyData} />;

  const sectionTitle = getText(companyData.sectionTitle);
  const sectionSubtitle = getText(companyData.sectionSubtitle);
  const hasPhilosophy = companyData.philosophy && getText(companyData.philosophy.title);
  const hasHistory = companyData.history?.timeline && Array.isArray(companyData.history.timeline) && companyData.history.timeline.length > 0;
  const hasCompanyInfo = companyData.companyInfo?.items && Array.isArray(companyData.companyInfo.items) && companyData.companyInfo.items.length > 0;

  if (!hasPhilosophy && !hasHistory && !hasCompanyInfo) {
    return <SectionError sectionName="Company" error="No company content found." data={companyData} />;
  }

  return (
    <section id="company" className="bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-4xl mx-auto">
        {(sectionTitle || sectionSubtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {sectionTitle && (
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && <p className="text-base text-[#333333]">{sectionSubtitle}</p>}
          </motion.div>
        )}

        <div className="space-y-12">
          {/* Philosophy */}
          {hasPhilosophy && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8F8F8] border border-[#E5E5E5] p-8 md:p-12"
            >
              <h3 className="text-2xl font-sans font-bold text-[#333333] mb-6 text-center">
                {getText(companyData.philosophy.title)}
              </h3>
              <p className="text-[#333333] text-base leading-relaxed text-center max-w-2xl mx-auto">
                {getText(companyData.philosophy.content)}
              </p>
            </motion.div>
          )}

          {/* Company Info */}
          {hasCompanyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#E5E5E5] p-8 md:p-12"
            >
              <h3 className="text-2xl font-sans font-bold text-[#333333] mb-8 border-b border-[#E5E5E5] pb-4">
                {getText(companyData.companyInfo.title)}
              </h3>
              <div className="flex flex-col">
                {companyData.companyInfo.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row py-4 border-b border-[#E5E5E5] last:border-0">
                    <div className="sm:w-1/3 font-sans font-bold text-[#333333] mb-2 sm:mb-0">
                      {getText(item.label)}
                    </div>
                    <div className="sm:w-2/3 text-[#333333]">
                      {getText(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* History */}
          {hasHistory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#E5E5E5] p-8 md:p-12"
            >
              <h3 className="text-2xl font-sans font-bold text-[#333333] mb-8 border-b border-[#E5E5E5] pb-4">
                {getText(companyData.history.title)}
              </h3>
              <div className="flex flex-col">
                {companyData.history.timeline.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row py-4 border-b border-[#E5E5E5] last:border-0">
                    <div className="sm:w-1/3 font-sans font-bold text-[#2D6A4F] mb-1 sm:mb-0">
                      {getText(item.year)}
                    </div>
                    <div className="sm:w-2/3 text-[#333333]">
                      {getText(item.event)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
