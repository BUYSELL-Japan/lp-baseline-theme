import React from 'react';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Menu() {
  const menuData = useMenuData();
  const { language } = useLanguage();

  if (!menuData) return <SectionError sectionName="Menu" error="No menu data available" />;

  const sectionTitle = getLocalizedValue(menuData, 'sectionTitle', language);
  const items = menuData.items || [];

  return (
    <section id="menu" className="py-24 md:py-32 px-6" style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'MENU'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col">
          {items.map((item, index) => {
            const name = getLocalizedValue(item, 'name', language);
            const price = getLocalizedValue(item, 'price', language);
            const description = getLocalizedValue(item, 'description', language);
            const hasImage = !!item.image;

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row w-full group py-8"
                style={{
                  borderBottom: '1px solid #D4541A',
                  borderTop: index === 0 ? '1px solid #D4541A' : 'none'
                }}
              >
                {/* 料理画像 */}
                {hasImage && (
                  <div className="w-full md:w-[30%] h-[200px] flex-shrink-0 mb-6 md:mb-0 md:mr-8 overflow-hidden">
                    <img
                      src={item.image}
                      alt={name}
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{ filter: 'grayscale(100%)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0%)')}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(100%)')}
                    />
                  </div>
                )}
                {!hasImage && (
                  <div className="hidden md:block w-[30%] h-[200px] flex-shrink-0 md:mr-8 border border-[#333333]" />
                )}

                {/* テキスト情報 */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
                    <h3
                      className="font-sans font-black text-[#FFFFFF] text-xl md:text-2xl tracking-widest"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
                    >
                      {name}
                    </h3>
                    <div
                      className="font-sans text-xl md:text-2xl font-bold whitespace-nowrap"
                      style={{ color: '#D4541A', fontFamily: "'Courier New', monospace" }}
                    >
                      {price}
                    </div>
                  </div>
                  <p
                    className="font-sans text-sm text-[#BBBBBB] leading-loose tracking-wider mt-4"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
