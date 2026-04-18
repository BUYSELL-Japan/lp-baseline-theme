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
    <section id="company" className="py-32 px-6 bg-amber-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Our Spirit</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {/* Philosophy */}
          {companyData.philosophy && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-12 md:p-20 shadow-[0_20px_60px_rgba(239,68,68,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Heart className="w-64 h-64 text-red-600 fill-current" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="p-6 bg-red-600 rounded-[2rem] shadow-xl shadow-red-500/20 shrink-0">
                  <Heart className="w-10 h-10 text-yellow-200" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-rose-900 mb-6 italic tracking-tight">
                    {getText(companyData.philosophy.title)}
                  </h3>
                  <p className="text-2xl font-bold text-orange-950/70 leading-relaxed italic">
                    {getText(companyData.philosophy.content)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* History */}
          {companyData.history && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-12 md:p-20 shadow-[0_20px_60px_rgba(251,191,36,0.1)]"
            >
              <div className="flex items-center gap-6 mb-16">
                <div className="p-6 bg-yellow-400 rounded-2xl shadow-lg">
                  <History className="w-10 h-10 text-rose-900" />
                </div>
                <h3 className="text-4xl font-black text-rose-900 italic tracking-tight">
                  {getText(companyData.history.title)}
                </h3>
              </div>
              <div className="relative ml-4 md:ml-20">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber-100 rounded-full" />
                <div className="space-y-12">
                  {companyData.history.timeline?.map((item, index) => (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-[-6px] top-2 w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                        <span className="text-2xl font-black text-red-600 italic leading-none">{getText(item.year)}</span>
                        <div className="h-[2px] w-8 bg-red-100 hidden md:block" />
                        <p className="text-xl font-bold text-orange-950/70">{getText(item.event)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Company Info */}
          {companyData.companyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-12 md:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-4 border-white"
            >
              <div className="flex items-center gap-6 mb-16">
                <div className="p-6 bg-rose-900 rounded-2xl shadow-xl">
                  <Building2 className="w-10 h-10 text-yellow-200" />
                </div>
                <h3 className="text-4xl font-black text-rose-900 italic tracking-tight underline decoration-yellow-400 decoration-8 underline-offset-8">
                  {getText(companyData.companyInfo.title)}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {companyData.companyInfo.items?.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2 pb-6 border-b border-orange-50">
                    <span className="text-xs font-black uppercase tracking-widest text-red-600">{getText(item.label)}</span>
                    <p className="text-xl font-bold text-orange-950/80">{getText(item.value)}</p>
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
