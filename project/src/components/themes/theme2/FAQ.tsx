import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function FAQ() {
  const faqData = useFAQData();
  const { getText } = useLocalize();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData) return <SectionError sectionName="FAQ" error="No FAQ data available" data={faqData} />;
  const sectionTitle = getText(faqData.sectionTitle);
  if (!sectionTitle) return <SectionError sectionName="FAQ" error="Missing section title" data={faqData} />;
  if (!faqData.items || !Array.isArray(faqData.items) || faqData.items.length === 0) {
    return <SectionError sectionName="FAQ" error="No FAQ items found." data={faqData} />;
  }

  return (
    <section id="faq" className="py-32 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-blue-500 mb-8" />
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            {sectionTitle}
          </h2>
          {faqData.sectionSubtitle && (
            <p className="text-xl text-slate-400">{getText(faqData.sectionSubtitle)}</p>
          )}
        </motion.div>

        <div className="space-y-3">
          {faqData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500/40 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-black text-white tracking-tight pr-4">
                  {getText(item.question)}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-blue-400" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-slate-800 pt-4">
                    <p className="text-slate-400 leading-relaxed">{getText(item.answer)}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
