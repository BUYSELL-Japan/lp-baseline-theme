import React from 'react';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function About() {
  const aboutData = useAboutData();
  const { language } = useLanguage();

  if (!aboutData) return <SectionError sectionName="About" error="No about data available" />;

  const sectionTitle = getLocalizedValue(aboutData, 'sectionTitle', language);
  const features = aboutData.features || [];

  return (
    <section id="about" className="scroll-mt-20 py-32 md:py-48 px-6" style={{ backgroundColor: '#111111', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'OUR CRAFT'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col space-y-24">
          {features.map((feature, index) => {
            const num = String(index + 1).padStart(2, '0');
            const title = getLocalizedValue(feature, 'title', language);
            const description = getLocalizedValue(feature, 'description', language);

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16"
              >
                {/* 番号 */}
                <div
                  className="flex-shrink-0 font-sans font-black leading-none select-none"
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(5rem, 12vw, 10rem)',
                    color: '#D4541A',
                    lineHeight: 0.8,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {num}
                </div>

                {/* ライン */}
                <div className="hidden md:block w-[2px] self-stretch" style={{ backgroundColor: '#D4541A', opacity: 0.5 }}></div>
                <div className="md:hidden w-full h-[2px]" style={{ backgroundColor: '#D4541A', opacity: 0.5 }}></div>

                {/* テキスト */}
                <div className="flex-1 pt-2 md:pt-6">
                  <h3
                    className="font-sans font-black text-[#FFFFFF] mb-8 tracking-[0.1em] text-[2rem] md:text-[3rem]"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-sans font-normal text-[#BBBBBB] text-base md:text-lg leading-loose tracking-wider"
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
