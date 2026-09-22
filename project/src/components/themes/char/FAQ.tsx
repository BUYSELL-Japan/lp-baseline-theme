import React, { useState } from 'react';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function FAQ() {
  const faqData = useFAQData();
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData) return <SectionError sectionName="FAQ" error="No FAQ data available" />;

  const sectionTitle = getLocalizedValue(faqData, 'sectionTitle', language);
  const items = faqData.items || [];

  if (items.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-20 py-32 md:py-48 px-6" style={{ backgroundColor: '#111111', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'FAQ'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col">
          {items.map((item, index) => {
            const question = getLocalizedValue(item, 'question', language);
            const answer = getLocalizedValue(item, 'answer', language);
            const isOpen = openIndex === index;
            return (
              <div key={index} style={{ borderBottom: '1px solid #D4541A' }}>
                <button
                  className="w-full flex items-start justify-between py-10 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span
                    className="font-sans text-xl md:text-2xl text-[#FFFFFF] leading-relaxed tracking-wider pr-8 font-bold"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    <span style={{ color: '#D4541A', marginRight: '1rem', fontFamily: 'monospace' }}>Q.</span>
                    {question}
                  </span>
                  <span
                    className="flex-shrink-0 text-2xl font-sans tracking-widest transition-colors duration-200"
                    style={{ fontFamily: 'monospace', color: isOpen ? '#D4541A' : '#666666' }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="pb-10 font-sans text-base md:text-lg text-[#BBBBBB] leading-loose tracking-wider"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif", paddingLeft: '2.5rem' }}
                  >
                    <span style={{ color: '#D4541A', marginRight: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>A.</span>
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
