import React from 'react';
import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { language } = useLanguage();

  if (!storeInfoData) return <SectionError sectionName="StoreInfo" error="No store info data available" />;

  const sectionTitle = getLocalizedValue(storeInfoData, 'sectionTitle', language);
  const items = storeInfoData.items || [];

  return (
    <section id="store-info" className="py-24 md:py-32 px-6" style={{ backgroundColor: '#111111', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'STORE INFO'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col">
          {items.map((item, index) => {
            const title = getLocalizedValue(item, 'title', language);
            const content = getLocalizedValue(item, 'content', language);
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 py-6 gap-2 md:gap-8"
                style={{ borderBottom: '1px solid #1C1C1C' }}
              >
                <div
                  className="font-sans text-base tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
                >
                  {title}
                </div>
                <div
                  className="md:col-span-2 font-sans text-base text-[#BBBBBB] leading-relaxed"
                  style={{ fontFamily: "'Noto Sans JP', monospace" }}
                >
                  {content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
