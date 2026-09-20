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
    <footer className="bg-[#F5F0E8] text-[#1a1a1a] pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 border-t border-[#C0392B]/30">
      <div className="max-w-7xl mx-auto">
        {/* Grid: Logo + sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          {/* Logo & description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
                
              </div>
              <span className="text-4xl font-serif tracking-widest uppercase">{logoText}</span>
            </div>
            <p className="text-[#1a1a1a] text-lg leading-relaxed max-w-md font-medium">
              {description}
            </p>
          </div>

          {/* Business hours */}
          {footerData.businessHours && (
            <div>
              <h3 className="text-sm font-serif tracking-widest uppercase tracking-[0.2em] text-[#C0392B] mb-8">
                {getText(footerData.businessHours.title)}
              </h3>
              <div className="space-y-4">
                <p className="text-[#1a1a1a] font-serif tracking-widest text-xl">{getText(footerData.businessHours.days)}</p>
                <p className="text-[#1a1a1a]/80 font-medium">{getText(footerData.businessHours.hours)}</p>
                <p className="text-[#1a1a1a] text-sm italic">{getText(footerData.businessHours.closedDay)}</p>
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
                <h3 className="text-sm font-serif tracking-widest uppercase tracking-[0.2em] text-[#C0392B] mb-8">
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
                        className="w-12 h-12 bg-[#F5F0E8] border border-[#C0392B]/20 rounded-2xl flex items-center justify-center hover:bg-[#F5F0E8] hover:border-[#C0392B]/50 transition-colors"
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
        <div className="pt-12 border-t border-[#C0392B]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#1a1a1a] text-sm font-serif tracking-widestst uppercase">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
          <a href="https://webdesign.neural-seeds.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
            Powered by Landy
          </a>
        </div>
      </div>
    </footer>
  );
}
