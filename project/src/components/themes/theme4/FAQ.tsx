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
    <section id="faq" className="py-32 px-6 bg-white relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Questions</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqData.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
                  isOpen ? 'bg-amber-50 shadow-xl' : 'bg-amber-50/30'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-2xl transition-all duration-300 ${
                      isOpen ? 'bg-red-600 text-yellow-200' : 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-yellow-200'
                    }`}>
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className={`text-xl font-black transition-colors ${
                      isOpen ? 'text-rose-900' : 'text-rose-900/70 group-hover:text-rose-900'
                    }`}>
                      {getText(item.question)}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className={`p-2 rounded-full ${isOpen ? 'bg-red-600 text-yellow-200' : 'text-red-600'}`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <div className="px-8 pb-8 pt-2 flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-6 h-6 text-rose-900" />
                        </div>
                        <p className="text-lg font-bold text-orange-950/70 leading-relaxed italic pr-4">
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
