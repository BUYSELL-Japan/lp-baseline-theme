import React from 'react';
import { useCompanyData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Company() {
  const companyData = useCompanyData();
  const { language } = useLanguage();

  if (!companyData) return <SectionError sectionName="Company" error="No company data available" />;

  const sectionTitle = getLocalizedValue(companyData, 'sectionTitle', language);
  const philosophy = companyData.philosophy;
  const history = companyData.history;
  const companyInfo = companyData.companyInfo;

  return (
    <section id="company" className="py-32 md:py-48 px-6" style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'COMPANY'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col space-y-24">
          {/* 経営理念 */}
          {philosophy && (
            <div>
              <h3
                className="font-sans text-base tracking-[0.2em] uppercase mb-8"
                style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
              >
                {getLocalizedValue(philosophy, 'title', language) || 'PHILOSOPHY'}
              </h3>
              <p
                className="font-sans text-base md:text-lg text-[#BBBBBB] leading-loose tracking-wider"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {getLocalizedValue(philosophy, 'content', language)}
              </p>
            </div>
          )}

          {/* 会社概要 */}
          {companyInfo && companyInfo.items && (
            <div>
              <h3
                className="font-sans text-base tracking-[0.2em] uppercase mb-8"
                style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
              >
                {getLocalizedValue(companyInfo, 'title', language) || 'INFO'}
              </h3>
              <div className="flex flex-col border-t" style={{ borderColor: 'rgba(212, 84, 26, 0.5)' }}>
                {companyInfo.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 py-6 gap-4"
                    style={{ borderBottom: '1px solid rgba(212, 84, 26, 0.5)' }}
                  >
                    <div className="font-sans text-base tracking-[0.1em] uppercase" style={{ fontFamily: 'monospace', color: '#D4541A' }}>
                      {getLocalizedValue(item, 'label', language)}
                    </div>
                    <div className="md:col-span-2 font-sans text-base text-[#BBBBBB] tracking-wider leading-relaxed" style={{ fontFamily: 'monospace' }}>
                      {getLocalizedValue(item, 'value', language)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 沿革 */}
          {history && history.timeline && (
            <div>
              <h3
                className="font-sans text-base tracking-[0.2em] uppercase mb-8"
                style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
              >
                {getLocalizedValue(history, 'title', language) || 'HISTORY'}
              </h3>
              <div className="flex flex-col border-t" style={{ borderColor: 'rgba(212, 84, 26, 0.5)' }}>
                {history.timeline.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 py-6 gap-4"
                    style={{ borderBottom: '1px solid rgba(212, 84, 26, 0.5)' }}
                  >
                    <div className="font-sans text-base tracking-widest" style={{ fontFamily: 'monospace', color: '#D4541A' }}>
                      {getLocalizedValue(item, 'year', language)}
                    </div>
                    <div className="md:col-span-3 font-sans text-base text-[#BBBBBB] tracking-wider leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {getLocalizedValue(item, 'event', language)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
