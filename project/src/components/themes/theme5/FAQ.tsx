import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
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
    <section id="faq" className="py-20 lg:py-28 bg-gray-100 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
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
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">FAQ</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
              {sectionTitle}
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-[#D4AF37]" />
          </div>
          <p className="text-sm text-gray-500 max-w-xs font-medium leading-relaxed">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* FAQ Items — accordion list */}
        <div className="divide-y divide-gray-300">
          {faqData.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-start justify-between text-left py-7 gap-6 group"
                >
                  <h3 className={`text-base lg:text-lg font-black leading-tight tracking-tight transition-colors ${
                    isOpen ? 'text-[#C0392B]' : 'text-gray-900 group-hover:text-gray-700'
                  }`}>
                    {getText(item.question)}
                  </h3>
                  <div className={`flex-shrink-0 w-7 h-7 border flex items-center justify-center transition-all ${
                    isOpen
                      ? 'border-[#C0392B] text-[#C0392B] bg-[#C0392B]/5'
                      : 'border-gray-400 text-gray-500 group-hover:border-gray-700'
                  }`}>
                    {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-0 border-l-2 border-[#D4AF37] pl-4 ml-0">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
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
