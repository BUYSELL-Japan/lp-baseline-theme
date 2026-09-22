import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { useFAQData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function FAQ() {
  const faqData = useFAQData();
  const { getText } = useLocalize();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData || !faqData.items || faqData.items.length === 0) {
    return <SectionError sectionName="FAQ" error="No FAQ data available" data={faqData} />;
  }

  return (
    <section id="faq" className="scroll-mt-20 bg-[#F8F8F8] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {getText(faqData.sectionTitle)}
          </h2>
          {faqData.sectionSubtitle && (
            <p className="text-base text-[#333333]">{getText(faqData.sectionSubtitle)}</p>
          )}
        </motion.div>

        <div className="space-y-4">
          {faqData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-[#E5E5E5]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F8F8F8] transition-colors"
              >
                <h3 className="font-sans font-bold text-[#333333] pr-4">
                  Q. {getText(item.question)}
                </h3>
                <span className="text-[#2D6A4F] text-xl leading-none">
                  {openIndex === index ? '−' : '＋'}
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2 border-t border-[#E5E5E5] mx-6 mt-2">
                  <p className="text-[#333333] leading-relaxed pt-4">
                    A. {getText(item.answer)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
