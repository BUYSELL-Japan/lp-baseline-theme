import React from 'react';
import { useFooterData, useHeaderData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';

export default function Footer() {
  const footerData = useFooterData();
  const headerData = useHeaderData();
  const { language } = useLanguage();

  if (!footerData) return null;

  const currentYear = new Date().getFullYear();
  const description = getLocalizedValue(footerData, 'description', language);
  const logoText = headerData ? getLocalizedValue(headerData.logo, 'text', language) : '';

  return (
    <footer className="bg-[#333333] pt-16 pb-8 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-sans font-bold text-white">{logoText}</span>
            </div>
            {description && (
              <p className="text-[#E5E5E5] text-sm leading-relaxed max-w-md">
                {description}
              </p>
            )}
          </div>

          {footerData.businessHours && (
            <div>
              <h3 className="text-sm font-sans font-bold text-white mb-6 border-b border-[#E5E5E5]/20 pb-2">
                {getLocalizedValue(footerData.businessHours, 'title', language)}
              </h3>
              <div className="space-y-2">
                <p className="text-white text-base">
                  {getLocalizedValue(footerData.businessHours, 'days', language)}
                </p>
                <p className="text-white text-base font-bold">
                  {getLocalizedValue(footerData.businessHours, 'hours', language)}
                </p>
                {footerData.businessHours.closedDay && (
                  <p className="text-[#E5E5E5] text-sm mt-2">
                    {getLocalizedValue(footerData.businessHours, 'closedDay', language)}
                  </p>
                )}
              </div>
            </div>
          )}

          {footerData.social && footerData.social.links && footerData.social.links.length > 0 && (
            <div>
              <h3 className="text-sm font-sans font-bold text-white mb-6 border-b border-[#E5E5E5]/20 pb-2">
                {getLocalizedValue(footerData.social, 'title', language)}
              </h3>
              <div className="flex flex-wrap gap-3">
                {footerData.social.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 flex items-center justify-center hover:bg-[#FFFFFF]/20 transition-colors"
                  >
                    <span className="text-xs uppercase font-bold text-white">{link.platform.substring(0, 2)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-[#FFFFFF]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#E5E5E5] text-sm font-sans">
            &copy; {currentYear} {getLocalizedValue(footerData, 'copyright', language)}
          </p>
          <a href="https://webdesign.neural-seeds.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#E5E5E5] hover:text-white transition-colors">
            Powered by Landy
          </a>
        </div>
      </div>
    </footer>
  );
}
