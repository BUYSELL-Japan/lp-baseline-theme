import React from 'react';
import { useContactData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Contact() {
  const contactData = useContactData();
  const { language } = useLanguage();

  if (!contactData) return <SectionError sectionName="Contact" error="No contact data available" />;

  const sectionTitle = getLocalizedValue(contactData, 'sectionTitle', language);
  const nameLabel = getLocalizedValue(contactData.fields, 'name', language) || 'NAME';
  const emailLabel = getLocalizedValue(contactData.fields, 'email', language) || 'EMAIL';
  const messageLabel = getLocalizedValue(contactData.fields, 'message', language) || 'MESSAGE';
  const submitLabel = getLocalizedValue(contactData, 'submitButton', language) || 'SEND';

  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32 px-6" style={{ backgroundColor: '#111111', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'CONTACT'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <form className="flex flex-col space-y-8">
          <div>
            <label
              className="block text-base tracking-[0.2em] uppercase mb-2 font-sans"
              style={{ fontFamily: 'monospace', color: '#BBBBBB' }}
            >
              {nameLabel}
            </label>
            <input
              type="text"
              className="w-full bg-transparent font-sans text-base text-[#CCCCCC] py-3 px-0 focus:outline-none"
              style={{
                fontFamily: 'monospace',
                borderBottom: '1px solid #333333',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = '#D4541A')}
              onBlur={(e) => (e.target.style.borderBottomColor = '#333333')}
            />
          </div>
          <div>
            <label
              className="block text-base tracking-[0.2em] uppercase mb-2 font-sans"
              style={{ fontFamily: 'monospace', color: '#BBBBBB' }}
            >
              {emailLabel}
            </label>
            <input
              type="email"
              className="w-full bg-transparent font-sans text-base text-[#CCCCCC] py-3 px-0 focus:outline-none"
              style={{
                fontFamily: 'monospace',
                borderBottom: '1px solid #333333',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = '#D4541A')}
              onBlur={(e) => (e.target.style.borderBottomColor = '#333333')}
            />
          </div>
          <div>
            <label
              className="block text-base tracking-[0.2em] uppercase mb-2 font-sans"
              style={{ fontFamily: 'monospace', color: '#BBBBBB' }}
            >
              {messageLabel}
            </label>
            <textarea
              rows={5}
              className="w-full bg-transparent font-sans text-base text-[#CCCCCC] py-3 px-0 focus:outline-none resize-none"
              style={{
                fontFamily: 'monospace',
                borderBottom: '1px solid #333333',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = '#D4541A')}
              onBlur={(e) => (e.target.style.borderBottomColor = '#333333')}
            />
          </div>
          <div className="pt-4">
            <button
              type="button"
              className="font-sans text-xs tracking-[0.25em] uppercase px-12 py-4 text-[#FFFFFF] transition-all duration-300"
              style={{
                fontFamily: "'Noto Sans JP', monospace",
                fontWeight: 900,
                backgroundColor: '#D4541A',
                border: '1px solid #D4541A',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#D4541A';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#D4541A';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
              }}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
