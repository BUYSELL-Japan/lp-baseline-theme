import { motion } from 'framer-motion';
import { Building2, History, Heart } from 'lucide-react';
import { useCompanyData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Company() {
  const companyData = useCompanyData();
  const { getText } = useLocalize();

  if (!companyData) return null;

  const sectionTitle = getText(companyData.sectionTitle);
  const sectionSubtitle = getText(companyData.sectionSubtitle);

  return (
    <section id="company" className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-0.5 h-10 bg-[#C0392B]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Company</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
              {sectionTitle}
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-[#D4AF37]" />
          </div>
          <p className="text-sm text-gray-500 max-w-sm font-medium leading-relaxed">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="space-y-0">
          {/* Philosophy Block */}
          {companyData.philosophy && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-stretch gap-0 mb-px"
            >
              <div className="w-full lg:w-1/3 bg-[#D4AF37] p-10 flex items-center justify-center">
                <Heart className="w-16 h-16 text-gray-950/30" />
              </div>
              <div className="w-full lg:w-2/3 bg-white border border-gray-200 border-l-0 p-10 lg:p-14">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  {getText(companyData.philosophy.title)}
                </h3>
                <div className="w-8 h-0.5 bg-[#D4AF37] mb-6" />
                <p className="text-base text-gray-600 leading-relaxed font-medium">
                  {getText(companyData.philosophy.content)}
                </p>
              </div>
            </motion.div>
          )}

          {/* History Block */}
          {companyData.history && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-950 p-10 lg:p-14 relative mb-px"
            >
              {/* Gold left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#D4AF37]" />

              <div className="flex items-center gap-6 mb-12">
                <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center">
                  <History className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {getText(companyData.history.title)}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800">
                {companyData.history.timeline?.map((item, index) => (
                  <div key={index} className="bg-gray-950 p-6 group hover:bg-gray-900 transition-colors">
                    <div className="text-[#D4AF37] text-2xl font-black tracking-tight mb-2">
                      {getText(item.year)}
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      className="w-full h-px bg-gray-700 mb-3 origin-left"
                    />
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{getText(item.event)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Company Info Block */}
          {companyData.companyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-10 lg:p-14"
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="w-10 h-10 border border-[#C0392B] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#C0392B]" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                  {getText(companyData.companyInfo.title)}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-gray-100 md:divide-y-0">
                {companyData.companyInfo.items?.map((item, index) => (
                  <div key={index} className="py-5 px-0 md:px-6 border-b border-gray-100 last:border-b-0 group">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C0392B] block mb-1">
                      {getText(item.label)}
                    </span>
                    <p className="text-base font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {getText(item.value)}
                    </p>
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
