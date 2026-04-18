import { motion } from 'framer-motion';
import { Sun, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Share2, HelpCircle } from 'lucide-react';
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
    <footer className="relative bg-red-950 text-white overflow-hidden">
      {/* Tropical Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 transform -translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-12">
        <div className="flex flex-col lg:flex-row justify-between gap-20 mb-24">
          
          {/* Logo & Desc Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="flex-1 max-w-md"
          >
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3">
                <Sun className="w-8 h-8 text-yellow-400" />
              </div>
              <span className="text-4xl font-black italic tracking-tighter uppercase leading-none">{logoText}</span>
            </div>
            <p className="text-xl font-black italic text-white/30 leading-tight">
              {description}
            </p>
          </motion.div>

          {/* Business Hours & Social Side */}
          <div className="flex-1 flex flex-col md:flex-row gap-20">
            {footerData.businessHours && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: 0.1 }}
                className="flex-1"
              >
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-8 underline decoration-yellow-400 decoration-4 underline-offset-8">
                  {getText(footerData.businessHours.title)}
                </h3>
                <div className="space-y-4">
                  <p className="text-2xl font-black italic tracking-tighter">{getText(footerData.businessHours.days)}</p>
                  <p className="text-3xl font-black text-yellow-400 tracking-tighter">{getText(footerData.businessHours.hours)}</p>
                  <p className="text-sm font-bold text-white/30 uppercase tracking-widest mt-6">{getText(footerData.businessHours.closedDay)}</p>
                </div>
              </motion.div>
            )}

            {footerData.social && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-8 underline decoration-yellow-400 decoration-4 underline-offset-8">
                  {getText(footerData.social.title)}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {footerData.social.links?.map((social, index) => {
                    const Icon = socialIconMap[social.platform.toLowerCase()] || HelpCircle;
                    return (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-yellow-400 shadow-xl shadow-red-500/10 hover:bg-yellow-400 hover:text-red-950 transition-all"
                      >
                        <Icon className="w-6 h-6" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
          <div className="w-12 h-1 bg-red-600 rounded-full" />
        </div>
      </div>
    </footer>
  );
}
