import { motion } from 'framer-motion';
import { useState } from 'react';

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
    <section id="faq" className="scroll-mt-20 bg-[#FFF9C4] py-16 sm:py-16 md:py-24 md:py-28 lg:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#7B2FBE] mb-8" />
          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter mb-4 border-b-8 border-[#7B2FBE] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
          {faqData.sectionSubtitle && (
            <p className="text-xl text-[#2D2D2D]">{getText(faqData.sectionSubtitle)}</p>
          )}
        </motion.div>

        <div className="space-y-3">
          {faqData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              className="bg-white rounded-2xl border border-[#FFBE0B]/30 overflow-hidden hover:border-[#FFBE0B] transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-sans font-black tracking-tight text-[#2D2D2D] tracking-tight pr-4">
                  {getText(item.question)}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-[#FFBE0B]/30 pt-4">
                    <p className="text-[#2D2D2D] leading-relaxed">{getText(item.answer)}</p>
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
