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
    <section id="company" className="scroll-mt-20 bg-white py-16 sm:py-16 md:py-24 md:py-28 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {(sectionTitle || sectionSubtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            {sectionTitle && (
              <>
                <div className="w-16 h-1 bg-[#7B2FBE] mb-8" />
                <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter mb-4 border-b-8 border-[#7B2FBE] pb-4 inline-block mb-4">
                  {sectionTitle}
                </h2>
              </>
            )}
            {sectionSubtitle && <p className="text-xl text-amber-900/80">{sectionSubtitle}</p>}
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
              className="bg-[#FFFFFF] rounded-3xl border border-[#FFBE0B]/20 p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#7B2FBE]/20 border border-[#FFBE0B]/30 p-4 rounded-2xl">
                  
                </div>
                <h3 className="text-4xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter">
                  {getText(companyData.philosophy.title)}
                </h3>
              </div>
              <p className="text-amber-900/80 text-lg leading-relaxed">
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
              className="bg-[#FFFFFF] rounded-3xl border border-[#FFBE0B]/20 p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#7B2FBE]/20 border border-[#FFBE0B]/30 p-4 rounded-2xl">
                  
                </div>
                <h3 className="text-4xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter">
                  {getText(companyData.history.title)}
                </h3>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[#FFFFFF]" />
                <div className="space-y-6">
                  {companyData.history.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-0 top-1 w-8 h-8 bg-[#7B2FBE] rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      </div>
                      <div className="bg-[#FFFFFF] rounded-xl p-4 border border-[#FFBE0B]/20">
                        <div className="font-sans font-black tracking-tight text-[#FB5607] mb-1">{getText(item.year)}</div>
                        <div className="text-[#1a1a1a]">{getText(item.event)}</div>
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
              className="bg-[#FFFFFF] rounded-3xl border border-[#FFBE0B]/20 p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#7B2FBE]/20 border border-[#FFBE0B]/30 p-4 rounded-2xl">
                  
                </div>
                <h3 className="text-4xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter">
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
                    className="flex flex-col md:flex-row md:items-start gap-2 py-3 border-b border-[#FFBE0B]/20"
                  >
                    <div className="font-sans font-black tracking-tight text-[#FB5607] text-sm uppercase tracking-widest min-w-[120px]">
                      {getText(item.label)}
                    </div>
                    <div className="text-[#1a1a1a] flex-1">{getText(item.value)}</div>
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
