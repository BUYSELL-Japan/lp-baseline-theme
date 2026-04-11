import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function FAQ() {
  const faqData = useFAQData();
  const { getText } = useLocalize();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData || !faqData.items || faqData.items.length === 0) return null;

  const sectionTitle = getText(faqData.sectionTitle);
  if (!sectionTitle) return null;

  return (
    <section id="faq" className="py-32 px-8 bg-stone-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <div className="w-8 h-px bg-amber-500 mx-auto mb-8" />
          <h2 className="font-serif text-4xl md:text-5xl text-stone-100 font-light tracking-wider mb-3">
            {sectionTitle}
          </h2>
          <p className="font-serif text-stone-500 text-base tracking-wide">
            {getText(faqData.sectionSubtitle)}
          </p>
          <div className="w-8 h-px bg-amber-500 mx-auto mt-8" />
        </motion.div>

        {/* FAQ items — no card, just text accordion on dark background */}
        <div className="divide-y divide-stone-800">
          {faqData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex items-start justify-between text-left group"
              >
                <h3 className="font-serif text-lg md:text-xl text-stone-200 font-light leading-snug tracking-wide pr-8 group-hover:text-amber-300 transition-colors duration-300">
                  {getText(item.question)}
                </h3>
                {/* Minimal +/- indicator */}
                <span className={`font-serif text-2xl leading-none shrink-0 mt-1 transition-all duration-500 ${openIndex === index ? 'text-amber-500 rotate-45' : 'text-stone-600 group-hover:text-stone-300'}`}>
                  +
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-10 pr-12">
                  <div className="w-6 h-px bg-amber-700 mb-6" />
                  <p className="font-serif text-stone-400 leading-loose text-base">
                    {getText(item.answer)}
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
