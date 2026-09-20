import React from 'react';
import { motion } from 'framer-motion';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function News() {
  const newsData = useNewsData();
  const { language } = useLanguage();

  if (!newsData || !newsData.items) return null;
  const sectionTitle = getLocalizedValue(newsData, 'sectionTitle', language);

  return (
    <section id="news" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'お知らせ'}
          </h2>
        </motion.div>

        <div className="w-full border-t border-[#EEEEEE]">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row py-8 border-b border-[#EEEEEE] gap-4"
            >
              <div className="w-full sm:w-1/4">
                <span className="text-[#888888] font-sans font-light text-xs tracking-widest block mb-2 sm:mb-0">
                  {getLocalizedValue(item, 'date', language)}
                </span>
                {item.category && (
                  <span className="inline-block text-[#6B8F71] text-[10px] tracking-widest border border-[#6B8F71] px-2 py-0.5 mt-2">
                    {getLocalizedValue(item, 'category', language)}
                  </span>
                )}
              </div>
              <div className="w-full sm:w-3/4">
                <h3 className="text-[#444444] font-sans font-medium text-sm leading-loose tracking-[0.1em] hover:text-[#6B8F71] transition-colors cursor-pointer">
                  {getLocalizedValue(item, 'title', language)}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
