import React from 'react';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function CTA() {
  const ctaData = useCTAData();
  const { language } = useLanguage();

  if (!ctaData) return <SectionError sectionName="CTA" error="No CTA data available" />;

  const sectionTitle = getLocalizedValue(ctaData, 'sectionTitle', language);
  const description = getLocalizedValue(ctaData, 'description', language);
  const buttons = ctaData.buttons || [];

  return (
    <section
      id="cta"
      className="py-24 md:py-32 px-6 text-center"
      style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #D4541A', borderBottom: '1px solid #D4541A' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-sans font-black text-[#FFFFFF] tracking-[0.1em] mb-6"
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          }}
        >
          {sectionTitle}
        </h2>
        {description && (
          <p
            className="font-sans text-sm text-[#888888] leading-loose tracking-wider mb-12"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {buttons.map((btn, index) => {
            const text = getLocalizedValue(btn, 'text', language);
            const isPrimary = btn.type === 'primary';
            return (
              <a
                key={index}
                href={btn.link}
                className="inline-block font-sans text-xs tracking-[0.25em] uppercase px-12 py-4 transition-all duration-300"
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  backgroundColor: isPrimary ? '#D4541A' : 'transparent',
                  color: isPrimary ? '#FFFFFF' : '#BBBBBB',
                  border: isPrimary ? '1px solid #D4541A' : '1px solid #444444',
                }}
                onMouseEnter={(e) => {
                  if (isPrimary) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#D4541A';
                  } else {
                    (e.currentTarget as HTMLElement).style.borderColor = '#D4541A';
                    (e.currentTarget as HTMLElement).style.color = '#D4541A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isPrimary) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#D4541A';
                    (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  } else {
                    (e.currentTarget as HTMLElement).style.borderColor = '#444444';
                    (e.currentTarget as HTMLElement).style.color = '#BBBBBB';
                  }
                }}
              >
                {text}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
