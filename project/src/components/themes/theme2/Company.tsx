import { motion } from 'framer-motion';
import { Building2, History, Heart } from 'lucide-react';
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
    <section id="company" className="py-32 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {(sectionTitle || sectionSubtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            {sectionTitle && (
              <>
                <div className="w-16 h-1 bg-blue-500 mb-8" />
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                  {sectionTitle}
                </h2>
              </>
            )}
            {sectionSubtitle && <p className="text-xl text-slate-400">{sectionSubtitle}</p>}
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
              className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-2xl">
                  <Heart className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {getText(companyData.philosophy.title)}
                </h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
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
              className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-2xl">
                  <History className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {getText(companyData.history.title)}
                </h3>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />
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
                      <div className="absolute left-0 top-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      </div>
                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                        <div className="font-black text-blue-400 mb-1">{getText(item.year)}</div>
                        <div className="text-slate-300">{getText(item.event)}</div>
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
              className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-2xl">
                  <Building2 className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter">
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
                    className="flex flex-col md:flex-row md:items-start gap-2 py-3 border-b border-slate-800"
                  >
                    <div className="font-black text-blue-400 text-sm uppercase tracking-widest min-w-[120px]">
                      {getText(item.label)}
                    </div>
                    <div className="text-slate-300 flex-1">{getText(item.value)}</div>
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
