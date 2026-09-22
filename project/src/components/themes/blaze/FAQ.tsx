import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function FAQ() {
  const faqData = useFAQData();
  const { language } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(0);

  if (!faqData || !faqData.items || faqData.items.length === 0) return null;
  const sectionTitle = getLocalizedValue(faqData, 'sectionTitle', language) || 'FAQ';

  return (
    <section id="faq" className="scroll-mt-20 py-24 bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-16 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F59E0B]">
          {sectionTitle}
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Questions */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {faqData.items.map((item, index) => {
              const q = getLocalizedValue(item, 'question', language);
              const isActive = activeFaq === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveFaq(index)}
                  className={`text-left px-6 py-5 font-bold text-lg sm:text-xl transition-all duration-200 border-2 ${
                    isActive 
                      ? 'border-[#DC2626] bg-[#DC2626]/10 text-white' 
                      : 'border-gray-800 bg-[#0a0a0a] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[#DC2626] font-black font-sans italic text-2xl leading-none">Q.</span>
                    <span className="pt-1">{q}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Answer */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-24 bg-[#0a0a0a] p-8 sm:p-12 border-t-8 border-[#DC2626] shadow-2xl min-h-[250px]">
              <div className="flex items-start gap-6">
                <span className="text-[#F59E0B] font-black font-sans italic text-6xl leading-none opacity-80">A.</span>
                <div className="pt-3 w-full">
                  {faqData.items.map((item, index) => {
                    if (activeFaq !== index) return null;
                    const a = getLocalizedValue(item, 'answer', language);
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed font-bold whitespace-pre-wrap">
                          {a}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
