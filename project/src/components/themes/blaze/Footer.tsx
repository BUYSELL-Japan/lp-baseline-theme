import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Share2, HelpCircle } from 'lucide-react';
import { useFooterData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  line: MessageCircle,
  tiktok: Share2,
};

export default function Footer() {
  const footerData = useFooterData();
  const { getText, t } = useLocalize();
  const currentYear = new Date().getFullYear();

  if (!footerData) return null;

  const logoText = typeof footerData.logo === 'string' ? footerData.logo : t(footerData.logo, 'text', '');
  const description = getText(footerData.description);

  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Grid: Logo + sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          {/* Logo & description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-[#DC2626] rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <BarChart3 className="text-white w-7 h-7" />
              </div>
              <span className="text-4xl font-sans font-black tracking-tighter font-bold tracking-wide tracking-tighter uppercase">{logoText}</span>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed max-w-md font-medium">
              {description}
            </p>
          </div>

          {/* Business hours */}
          {footerData.businessHours && (
            <div>
              <h3 className="text-sm font-sans font-black tracking-tighter font-bold tracking-wide uppercase tracking-[0.2em] text-[#F59E0B] mb-8">
                {getText(footerData.businessHours.title)}
              </h3>
              <div className="space-y-4">
                <p className="text-white font-sans font-black tracking-tighter font-bold tracking-wide text-xl">{getText(footerData.businessHours.days)}</p>
                <p className="text-gray-400 font-medium">{getText(footerData.businessHours.hours)}</p>
                <p className="text-gray-300 text-sm italic">{getText(footerData.businessHours.closedDay)}</p>
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
                <h3 className="text-sm font-sans font-black tracking-tighter font-bold tracking-wide uppercase tracking-[0.2em] text-[#F59E0B] mb-8">
                  {getText(footerData.social.title)}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {validLinks.map((social, index) => {
                    const platformName = typeof social.platform === 'string' ? social.platform : (getText(social.platform) || '');
                    const platformKey = platformName.toLowerCase();
                    const IconComponent = socialIconMap[platformKey] || HelpCircle;
                    return (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-[#1a1a1a] border border-[#F59E0B]/20 rounded-2xl flex items-center justify-center hover:bg-[#2a2a2a] hover:border-[#F59E0B]/50 transition-colors"
                      >
                        <IconComponent className="w-5 h-5 text-gray-400" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>{/* end grid */}

        {/* Copyright */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-300 text-sm font-sans font-black tracking-tighter font-bold tracking-widest uppercase">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
          <a href="https://webdesign.neural-seeds.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-300 hover:text-white transition-colors">
            Powered by Landy
          </a>
        </div>
      </div>
    </footer>
  );
}
