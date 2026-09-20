import React from 'react';
import { useFooterData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Footer() {
  const footerData = useFooterData();
  const { language } = useLanguage();

  if (!footerData) return null;

  const logo = footerData.logo || '';
  const description = getLocalizedValue(footerData, 'description', language);
  const copyright = getLocalizedValue(footerData, 'copyright', language);
  const hoursTitle = getLocalizedValue(footerData.businessHours, 'title', language);
  const days = getLocalizedValue(footerData.businessHours, 'days', language);
  const hours = getLocalizedValue(footerData.businessHours, 'hours', language);
  const closedDay = getLocalizedValue(footerData.businessHours, 'closedDay', language);

  return (
    <footer
      className="py-16 px-6"
      style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #D4541A' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* ロゴ・説明 */}
          <div>
            <div
              className="font-sans font-black text-[#FFFFFF] text-lg tracking-[0.2em] mb-4"
              style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
            >
              {logo}
            </div>
            <p
              className="font-sans text-xs text-[#666666] leading-loose tracking-wider whitespace-pre-line"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {description}
            </p>
          </div>

          {/* 営業時間 */}
          <div>
            <div
              className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
            >
              {hoursTitle || 'HOURS'}
            </div>
            <div className="font-sans text-xs text-[#666666] leading-loose tracking-wider" style={{ fontFamily: 'monospace' }}>
              <div>{days}</div>
              <div>{hours}</div>
              <div>{closedDay}</div>
            </div>
          </div>

          {/* SNS */}
          {footerData.social?.links && footerData.social.links.length > 0 && (
            <div>
              <div
                className="font-sans text-xs tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
              >
                {getLocalizedValue(footerData.social, 'title', language) || 'FOLLOW'}
              </div>
              <div className="flex flex-col space-y-2">
                {footerData.social.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs tracking-widest transition-colors duration-200"
                    style={{ fontFamily: 'monospace', color: '#666666' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4541A')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* コピーライト */}
        <div
          className="pt-8 font-sans text-xs text-[#333333] tracking-widest"
          style={{ fontFamily: 'monospace', borderTop: '1px solid #1C1C1C' }}
        >
          {copyright}
        </div>
      </div>
    </footer>
  );
}
