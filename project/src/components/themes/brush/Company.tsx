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
    <section id="company" className="scroll-mt-20 bg-[#1a1a1a] text-white py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {(sectionTitle || sectionSubtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center md:text-left"
          >
            {sectionTitle && (
              <>
                <h2 className="text-5xl md:text-7xl font-serif tracking-widest text-white tracking-tighter mb-4 inline-block">
                  {sectionTitle}
                </h2>
                <div className="w-24 h-2 bg-[#C0392B] mb-8 md:mx-0 mx-auto" />
              </>
            )}
            {sectionSubtitle && <p className="text-xl font-serif text-[#E5E5E5]">{sectionSubtitle}</p>}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Philosophy */}
          {hasPhilosophy && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-transparent border border-[#1a1a1a] rounded-none p-8 md:p-12 border-t border-[#C0392B]/30"
            >
              <div className="mb-8">
                <h3 className="text-4xl font-serif tracking-widest text-[#C0392B] tracking-tighter">
                  {getText(companyData.philosophy.title)}
                </h3>
              </div>
              <p className="text-[#E5E5E5] text-lg leading-relaxed font-serif">
                {getText(companyData.philosophy.content)}
              </p>
            </motion.div>
          )}

          {/* History */}
          {hasHistory && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-transparent border border-[#1a1a1a] rounded-none p-8 md:p-12 border-t border-[#C0392B]/30"
            >
              <div className="mb-10">
                <h3 className="text-4xl font-serif tracking-widest text-[#C0392B] tracking-tighter">
                  {getText(companyData.history.title)}
                </h3>
              </div>
              <div className="relative">
                <div className="absolute left-[7px] top-0 bottom-0 w-px bg-white/20" />
                <div className="space-y-8">
                  {companyData.history.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-0 top-2 w-4 h-4 bg-[#C0392B] rounded-none" />
                      <div className="bg-transparent">
                        <div className="font-serif font-bold tracking-widest text-white mb-1 text-xl">{getText(item.year)}</div>
                        <div className="text-[#E5E5E5] text-lg font-serif">{getText(item.event)}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Company Info */}
          {hasCompanyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-transparent border border-[#1a1a1a] rounded-none p-8 md:p-12 border-t border-[#C0392B]/30"
            >
              <div className="mb-10">
                <h3 className="text-4xl font-serif tracking-widest text-[#C0392B] tracking-tighter">
                  {getText(companyData.companyInfo.title)}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData.companyInfo.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex flex-col md:flex-row md:items-start gap-4 py-4 border-b border-white/10"
                  >
                    <div className="font-serif font-bold tracking-widest text-white text-base uppercase min-w-[140px]">
                      {getText(item.label)}
                    </div>
                    <div className="text-[#E5E5E5] flex-1 text-lg font-serif leading-relaxed">{getText(item.value)}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
