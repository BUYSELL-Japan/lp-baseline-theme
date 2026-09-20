import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function FAQ() {
  const faqData = useFAQData();
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData || !faqData.items || faqData.items.length === 0) return null;
  const sectionTitle = getLocalizedValue(faqData, 'sectionTitle', language);

  return (
    <section id="faq" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'よくある質問'}
          </h2>
        </motion.div>

        <div className="w-full border-t border-[#EEEEEE]">
          {faqData.items.map((item, index) => (
            <div key={index} className="border-b border-[#EEEEEE]">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex items-center justify-between text-left text-[#444444] font-sans font-medium text-sm tracking-widest hover:text-[#6B8F71] transition-colors"
              >
                <span className="pr-4 leading-loose">{getLocalizedValue(item, 'question', language)}</span>
                <span className="text-xs font-light tracking-[0] shrink-0 text-[#888888]">
                  {openIndex === index ? 'ー' : '＋'}
                </span>
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-8 text-[#888888] font-light text-xs md:text-sm leading-loose tracking-widest pl-4 border-l-2 border-[#6B8F71]/30 ml-2">
                  {getLocalizedValue(item, 'answer', language)}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
