import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function FAQ() {
  const faqData = useFAQData();
  const { getText } = useLocalize();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData || !faqData.items) return null;

  const sectionTitle = getText(faqData.sectionTitle);
  const sectionSubtitle = getText(faqData.sectionSubtitle);

  return (
    <section id="faq" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-red-600 opacity-[0.02] rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end gap-12 mb-24">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqData.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col rounded-[3rem] p-8 md:p-10 transition-all duration-500 overflow-hidden ${
                  isOpen ? 'bg-red-50 shadow-2xl scale-105 z-20' : 'bg-red-50/40 hover:bg-red-50'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-start justify-between text-left group gap-4"
                >
                  <h3 className={`text-xl md:text-2xl font-black italic tracking-tighter leading-tight transition-colors ${
                    isOpen ? 'text-red-600' : 'text-red-950'
                  }`}>
                    {getText(item.question)}
                  </h3>
                  <div className={`mt-1 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-red-600' : 'text-red-900/30'}`}>
                    <ChevronDown className="w-8 h-8" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 border-t border-red-100 mt-6">
                        <p className="text-lg font-bold text-red-950/60 leading-relaxed italic">
                          {getText(item.answer)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
