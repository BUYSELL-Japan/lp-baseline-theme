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
    <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <BarChart3 className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">{logoText}</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
              {description}
            </p>
          </div>

          {footerData.businessHours && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8">
                {getText(footerData.businessHours.title)}
              </h3>
              <div className="space-y-4">
                <p className="text-white font-black text-xl">{getText(footerData.businessHours.days)}</p>
                <p className="text-slate-400 font-medium">{getText(footerData.businessHours.hours)}</p>
                <p className="text-slate-600 text-sm italic">{getText(footerData.businessHours.closedDay)}</p>
              </div>
            </div>
          )}

          {footerData.social?.links && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8">
                {getText(footerData.social.title)}
              </h3>
              <div className="flex flex-wrap gap-4">
                {footerData.social.links.map((social, index) => {
                  const platformKey = (social.platform || '').toLowerCase();
                  const IconComponent = socialIconMap[platformKey] || HelpCircle;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center hover:bg-slate-800 hover:border-blue-500/50 transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}

        <div className="pt-12 border-t border-slate-900">
          <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
}
