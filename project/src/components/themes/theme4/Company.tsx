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
    <section id="company" className="py-32 px-6 bg-red-50/10 relative overflow-hidden">
      {/* Background Decor - Removed filler text */}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end gap-12 mb-32">
          <div className="flex-1">
            <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-8 italic tracking-tighter leading-none">
              {sectionTitle}
            </h2>
            <div className="w-24 h-4 bg-red-600 rounded-full shadow-lg" />
          </div>
          <p className="flex-1 text-xl md:text-2xl font-black text-red-900/40 italic">
            {sectionSubtitle}
          </p>
        </div>

        <div className="space-y-32">
          {/* Philosophy Island */}
          {companyData.philosophy && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-4/5 mr-auto bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Heart className="w-96 h-96 text-red-600 fill-current" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl shrink-0 rotate-3">
                  <Heart className="w-12 h-12 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-red-950 mb-8 italic tracking-tighter">
                    {getText(companyData.philosophy.title)}
                  </h3>
                  <p className="text-xl md:text-3xl font-black text-red-950/60 leading-tight italic">
                    {getText(companyData.philosophy.content)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* History Island */}
          {companyData.history && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-4/5 ml-auto bg-red-950 rounded-[4rem] p-12 md:p-24 shadow-2xl text-white relative overflow-hidden"
            >
              <div className="flex items-center gap-8 mb-20">
                <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shrink-0 -rotate-6">
                  <History className="w-10 h-10 text-red-950" />
                </div>
                <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter underline decoration-red-600 decoration-8 underline-offset-8">
                  {getText(companyData.history.title)}
                </h3>
              </div>
              <div className="space-y-16">
                {companyData.history.timeline?.map((item, index) => (
                  <div key={index} className="flex gap-8 group">
                    <div className="text-4xl font-black text-yellow-400 italic tracking-tighter group-hover:scale-110 transition-transform duration-300">
                      {getText(item.year)}
                    </div>
                    <div className="flex-1 pt-3">
                      <div className="w-full h-1 bg-white/10 mb-4 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          className="h-full bg-red-600 origin-left"
                        />
                      </div>
                      <p className="text-2xl font-black italic text-white/80">{getText(item.event)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Info Island - Table Style But Unique */}
          {companyData.companyInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-4/5 mx-auto bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border-8 border-red-50"
            >
              <div className="flex items-center gap-8 mb-20 justify-end text-right">
                <h3 className="text-4xl md:text-6xl font-black text-red-950 italic tracking-tighter">
                  {getText(companyData.companyInfo.title)}
                </h3>
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shrink-0 rotate-12">
                  <Building2 className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                {companyData.companyInfo.items?.map((item, index) => (
                  <div key={index} className="group border-b-4 border-red-50 pb-8 hover:border-red-600 transition-colors">
                    <span className="text-xs font-black uppercase tracking-widest text-red-600 mb-2 block">{getText(item.label)}</span>
                    <p className="text-xl md:text-2xl font-black text-red-950 italic tracking-tighter">
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
