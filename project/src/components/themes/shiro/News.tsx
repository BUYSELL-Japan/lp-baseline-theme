import React from 'react';
import { motion } from 'framer-motion';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function News() {
  const newsData = useNewsData();
  const { language } = useLanguage();

  if (!newsData || !newsData.items) return <SectionError sectionName="News" error="No news data available" data={newsData} />;

  return (
    <section id="news" className="bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {getLocalizedValue(newsData, 'sectionTitle', language)}
          </h2>
          {newsData.sectionSubtitle && (
            <p className="text-base text-[#333333]">{getLocalizedValue(newsData, 'sectionSubtitle', language)}</p>
          )}
        </motion.div>

        <div className="border-t border-[#E5E5E5]">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col md:flex-row md:items-center py-6 border-b border-[#E5E5E5] hover:bg-[#F8F8F8] transition-colors px-4 cursor-pointer"
            >
              <div className="w-40 flex-shrink-0 mb-2 md:mb-0">
                <span className="text-[#333333] font-sans font-bold">
                  {item.date}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-[#333333] font-sans text-base group-hover:text-[#2D6A4F] transition-colors">
                  {getLocalizedValue(item, 'title', language)}
                </h3>
              </div>
              {item.category && (
                <div className="mt-2 md:mt-0 md:ml-4">
                  <span className="inline-block border border-[#2D6A4F] text-[#2D6A4F] text-xs px-3 py-1 bg-white">
                    {getLocalizedValue(item, 'category', language)}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
