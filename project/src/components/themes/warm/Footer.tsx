import React from 'react';
import { motion } from 'framer-motion';

import { useFooterData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';



export default function Footer() {
  const footerData = useFooterData();
  const { getText, t } = useLocalize();
  const currentYear = new Date().getFullYear();

  if (!footerData) return null;

  const logoText = typeof footerData.logo === 'string' ? footerData.logo : t(footerData.logo, 'text', '');
  const description = getText(footerData.description);

  return (
    <footer className="bg-[#FFFBF0] text-[#1C1917] pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 border-t border-[#D97706]/30">
      <div className="max-w-7xl mx-auto">
        {/* Grid: Logo + sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-[#92400E] rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">

              </div>
              <span className="text-4xl font-sans font-bold tracking-normal uppercase">{logoText}</span>
            </div>
            <p className="text-[#1C1917] text-lg leading-relaxed max-w-md font-medium">
              {description}
            </p>
          </div>

          {/* Business hours */}
          {footerData.businessHours && (
            <div>
              <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#D97706] mb-8">
                {getText(footerData.businessHours.title)}
              </h3>
              <div className="space-y-4">
                <p className="text-[#1C1917] font-sans font-bold tracking-normal text-xl">{getText(footerData.businessHours.days)}</p>
                <p className="text-amber-900/80 font-medium">{getText(footerData.businessHours.hours)}</p>
                <p className="text-[#92400E] text-sm italic">{getText(footerData.businessHours.closedDay)}</p>
              </div>
            </div>
          )}

          {/* Social links */}
          {footerData.social?.links && (() => {
            const validLinks = footerData.social.links.filter(
              (s) => s.url && s.url.trim() !== '' && s.url.trim() !== '#'
            );
            if (validLinks.length === 0) return null;
            return (
              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#D97706] mb-8">
                  {getText(footerData.social.title)}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {validLinks.map((social, index) => {
                    const platformName = typeof social.platform === 'string' ? social.platform : (getText(social.platform) || '');
                    return (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-[#FFFBF0] border border-[#D97706]/20 rounded-2xl flex items-center justify-center hover:bg-[#FEF3C7] hover:border-[#D97706]/50 transition-colors"
                      >
                        SNS
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>{/* end grid */}

        {/* Copyright */}
        <div className="pt-12 border-t border-[#D97706]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#92400E] text-sm font-sans font-bold uppercase tracking-widest">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
          <a href="https://webdesign.neural-seeds.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#92400E] hover:text-[#1C1917] transition-colors">
            Powered by Landy
          </a>
        </div>
      </div>
    </footer>
  );
}
