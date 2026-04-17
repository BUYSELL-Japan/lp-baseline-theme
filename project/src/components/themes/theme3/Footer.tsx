import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Share2, HelpCircle } from 'lucide-react';
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
    <footer className="bg-stone-800 text-stone-200 py-20 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-8 h-px bg-amber-500/50 mx-auto mb-8" />
          <span className="font-serif text-3xl font-light tracking-[0.25em] text-stone-100">
            {logoText}
          </span>
          <div className="w-8 h-px bg-amber-500/50 mx-auto mt-8 mb-10" />
          <p className="font-serif text-stone-400 leading-loose max-w-md mx-auto text-sm">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-16 pt-12 border-t border-stone-700">
          {footerData.businessHours && (
            <div>
              <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-amber-500/80 mb-5">
                {getText(footerData.businessHours.title)}
              </h3>
              <p className="font-serif text-stone-300 font-light">{getText(footerData.businessHours.days)}</p>
              <p className="font-serif text-stone-300 font-light">{getText(footerData.businessHours.hours)}</p>
              <p className="font-serif text-stone-500 text-sm mt-2">{getText(footerData.businessHours.closedDay)}</p>
            </div>
          )}

          {footerData.social && footerData.social.links && (
            <div>
              <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-amber-500/80 mb-5">
                {getText(footerData.social.title)}
              </h3>
              <div className="flex justify-center gap-5">
                {footerData.social.links.map((social, index) => {
                  const platformKey = (social.platform || '').toLowerCase();
                  const IconComponent = socialIconMap[platformKey] || HelpCircle;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ y: -3 }}
                      className="text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}
        </div>


        <div className="pt-8 border-t border-stone-700 text-center">
          <p className="font-serif text-stone-600 text-xs tracking-[0.2em]">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
}
