import React from 'react';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, getNewsCategory } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function News() {
  const newsData = useNewsData();
  const { language } = useLanguage();

  if (!newsData) return <SectionError sectionName="News" error="No news data available" />;

  const sectionTitle = getLocalizedValue(newsData, 'sectionTitle', language);
  const items = newsData.items || [];

  return (
    <section id="news" className="py-32 md:py-48 px-6" style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'NEWS'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col space-y-8">
          {items.map((item, index) => {
            const date = getLocalizedValue(item, 'date', language);
            const category = getNewsCategory(item.category, language);
            const title = getLocalizedValue(item, 'title', language);
            return (
              <div
                key={index}
                className="group cursor-pointer bg-[#111111] p-8 md:p-10 transition-all duration-300"
                style={{ borderLeft: '4px solid #D4541A', borderTop: '1px solid #2A2A2A', borderRight: '1px solid #2A2A2A', borderBottom: '1px solid #2A2A2A' }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-6 md:w-1/3">
                    <span
                      className="font-sans text-xl font-bold tracking-widest"
                      style={{ fontFamily: 'monospace', color: '#D4541A' }}
                    >
                      {date}
                    </span>
                    <span
                      className="font-sans text-xs tracking-[0.15em] uppercase px-3 py-1"
                      style={{ fontFamily: 'monospace', color: '#BBBBBB', border: '1px solid #BBBBBB' }}
                    >
                      {category}
                    </span>
                  </div>
                  <div className="md:flex-1">
                    <span
                      className="font-sans text-xl text-[#FFFFFF] group-hover:text-[#D4541A] transition-colors duration-200 leading-relaxed tracking-wider font-bold"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
