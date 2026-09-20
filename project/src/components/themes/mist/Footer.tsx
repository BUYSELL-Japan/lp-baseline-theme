import React from 'react';
import { useFooterData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Footer() {
  const footerData = useFooterData();
  const { language } = useLanguage();

  if (!footerData) return <SectionError sectionName="Footer" error="No footer data available" />;

  const logoText = getLocalizedValue(footerData.logo, 'text', language);
  const description = getLocalizedValue(footerData, 'description', language);

  return (
    <footer className="bg-[#FFFFFF] py-24 px-6 border-t border-[#EEEEEE]">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="mb-12">
          {footerData.logo.image ? (
            <img 
              src={footerData.logo.image} 
              alt={logoText || 'Logo'} 
              className="h-8 object-contain grayscale opacity-80"
            />
          ) : (
            <span className="text-lg font-sans font-medium text-[#222222] tracking-[0.2em]">
              {logoText}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-[#888888] font-light text-xs tracking-widest mb-16 max-w-md leading-loose">
            {description}
          </p>
        )}

        <div className="w-full h-px bg-[#EEEEEE] mb-12" />

        <div className="text-[#888888] text-[10px] uppercase tracking-[0.3em]">
          {getLocalizedValue(footerData, 'copyright', language)}
        </div>
      </div>
    </footer>
  );
}
