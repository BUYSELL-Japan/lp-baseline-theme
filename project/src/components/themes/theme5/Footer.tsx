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
    <footer className="relative bg-gray-950 text-white overflow-hidden">
      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />

      {/* Cymbal disc decorative circles (top right) */}
      <div className="absolute right-12 top-8 w-40 h-40 border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute right-20 top-16 w-24 h-24 border border-[#D4AF37]/10 rounded-full pointer-events-none" />
      <div className="absolute right-28 top-24 w-8 h-8 rounded-full border border-[#D4AF37]/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="flex flex-col lg:flex-row justify-between gap-14 mb-14">

          {/* Logo & Desc */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xs"
          >
            {/* Logo - minimal cymbal disc + text */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/60 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]/60" />
              </div>
              <span className="text-lg font-black uppercase tracking-[0.2em] text-white">
                {logoText}
              </span>
            </div>
            <div className="w-8 h-px bg-[#D4AF37] mb-5" />
            <p className="text-sm font-medium text-gray-500 leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Business Hours & Social */}
          <div className="flex flex-col sm:flex-row gap-14">
            {footerData.businessHours && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 flex items-center gap-3">
                  <span className="w-0.5 h-4 bg-[#C0392B]" />
                  {getText(footerData.businessHours.title)}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400">
                    {getText(footerData.businessHours.days)}
                  </p>
                  <p className="text-xl font-black text-[#D4AF37] tracking-tight">
                    {getText(footerData.businessHours.hours)}
                  </p>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-widest mt-4">
                    {getText(footerData.businessHours.closedDay)}
                  </p>
                </div>
              </motion.div>
            )}

            {footerData.social && (() => {
              const validLinks = (footerData.social.links || []).filter(
                (s) => s.url && s.url.trim() !== '' && s.url.trim() !== '#'
              );
              if (validLinks.length === 0) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 flex items-center gap-3">
                    <span className="w-0.5 h-4 bg-[#C0392B]" />
                    {getText(footerData.social.title)}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {validLinks.map((social, index) => {
                      const platformName = typeof social.platform === 'string' ? social.platform : (getText(social.platform) || '');
                      const platformKey = platformName.toLowerCase();
                      const Icon = socialIconMap[platformKey] || HelpCircle;
                      return (
                        <motion.a
                          key={index}
                          href={social.url}
                          whileHover={{ y: -2 }}
                          className="w-10 h-10 border border-gray-700 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-[10px] font-bold text-gray-700 tracking-[0.3em] uppercase">
              &copy; {currentYear} {getText(footerData.copyright)}
            </p>
            <a href="https://webdesign.neural-seeds.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-gray-700 tracking-[0.1em] uppercase hover:text-[#D4AF37] transition-colors">
              Powered by Landy
            </a>
          </div>
          {/* Red noren symbolic divider */}
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-4 bg-[#C0392B]" />
            <div className="w-0.5 h-3 bg-[#C0392B]/60" />
            <div className="w-0.5 h-2 bg-[#C0392B]/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
