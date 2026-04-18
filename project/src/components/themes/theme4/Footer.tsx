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
    <footer className="relative bg-rose-950 text-white overflow-hidden pt-20">
      {/* Tropical Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 transform -translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px] fill-amber-50">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-600 rounded-2xl shadow-lg">
                <Sun className="w-8 h-8 text-yellow-200" />
              </div>
              <span className="text-3xl font-black italic tracking-tighter uppercase">{logoText}</span>
            </div>
            <p className="text-yellow-100/70 leading-relaxed font-bold italic text-lg">
              {description}
            </p>
          </motion.div>

          {footerData.businessHours && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h3 className="text-xl font-black uppercase tracking-widest text-yellow-400 mb-8 underline decoration-red-600 decoration-4 underline-offset-8">
                {getText(footerData.businessHours.title)}
              </h3>
              <div className="space-y-4 font-bold text-lg">
                <p className="text-white">{getText(footerData.businessHours.days)}</p>
                <p className="text-yellow-100">{getText(footerData.businessHours.hours)}</p>
                <p className="text-red-400 text-sm mt-4 italic">{getText(footerData.businessHours.closedDay)}</p>
              </div>
            </motion.div>
          )}

          {footerData.social && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-black uppercase tracking-widest text-yellow-400 mb-8 underline decoration-red-600 decoration-4 underline-offset-8">
                {getText(footerData.social.title)}
              </h3>
              <div className="flex flex-wrap gap-4">
                {footerData.social.links?.map((social, index) => {
                  const Icon = socialIconMap[social.platform.toLowerCase()] || HelpCircle;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="bg-red-600 p-4 rounded-2xl text-yellow-200 shadow-lg shadow-red-500/10 hover:bg-yellow-400 hover:text-rose-900 transition-colors"
                    >
                      <Icon className="w-6 h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        <div className="pt-12 border-t border-white/10 text-center">
          <p className="text-yellow-100/30 font-bold text-sm tracking-widest uppercase">
            &copy; {currentYear} {getText(footerData.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
}
