import React from 'react';
import { useAccessData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Access() {
  const accessData = useAccessData();
  const { language } = useLanguage();

  if (!accessData) return <SectionError sectionName="Access" error="No access data available" />;

  const sectionTitle = getLocalizedValue(accessData, 'sectionTitle', language);

  return (
    <section id="access" className="scroll-mt-20 py-32 md:py-48 px-6" style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'ACCESS'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col space-y-12">
          {/* マップ */}
          <div className="w-full aspect-video" style={{ border: '2px solid #D4541A', filter: 'grayscale(100%)' }}>
            {accessData.mapEmbedUrl ? (
              <iframe
                src={accessData.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Map"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-sans text-[#444444] text-xs tracking-[0.3em]" style={{ fontFamily: 'monospace' }}>
                MAP
              </div>
            )}
          </div>

          <div className="flex flex-col pt-8">
            {/* 住所 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8" style={{ borderBottom: '1px solid rgba(212, 84, 26, 0.5)' }}>
              <div className="font-sans text-base tracking-[0.2em] uppercase" style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}>ADDRESS</div>
              <div className="md:col-span-2 font-sans text-base text-[#BBBBBB] leading-loose tracking-wider" style={{ fontFamily: 'monospace' }}>
                {getLocalizedValue(accessData, 'address', language)}
              </div>
            </div>

            {/* 交通アクセス */}
            {accessData.transportation && accessData.transportation.methods && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8" style={{ borderBottom: '1px solid rgba(212, 84, 26, 0.5)' }}>
                <div className="font-sans text-base tracking-[0.2em] uppercase" style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}>
                  {getLocalizedValue(accessData.transportation, 'title', language) || 'TRANSIT'}
                </div>
                <div className="md:col-span-2 flex flex-col space-y-4">
                  {accessData.transportation.methods.map((method, index) => (
                    <div key={index} className="font-sans text-base text-[#BBBBBB] leading-loose tracking-wider" style={{ fontFamily: 'monospace' }}>
                      {getLocalizedValue(method, 'type', language)}: {getLocalizedValue(method, 'description', language)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 駐車場 */}
            {accessData.parking && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8" style={{ borderBottom: '1px solid rgba(212, 84, 26, 0.5)' }}>
                <div className="font-sans text-base tracking-[0.2em] uppercase" style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}>PARKING</div>
                <div className="md:col-span-2 font-sans text-base text-[#BBBBBB] leading-loose tracking-wider" style={{ fontFamily: 'monospace' }}>
                  {getLocalizedValue(accessData.parking, 'description', language)}
                  {accessData.parking.spaces && (
                    <span className="ml-2" style={{ color: '#D4541A' }}>({accessData.parking.spaces})</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
