import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function CTA() {
  const ctaData = useCTAData();
  const { getText } = useLocalize();

  if (!ctaData || !ctaData.buttons) return null;

  const sectionTitle = getText(ctaData.sectionTitle);

  return (
    <section className="relative py-48 px-6 overflow-hidden bg-rose-950">
      <div className="absolute inset-0">
        <img
          src={ctaData.backgroundImage}
          alt="Background"
          className="w-full h-full object-cover scale-110 blur-sm opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 text-left"
          >
            <h2 className="text-6xl md:text-9xl font-black text-white mb-12 italic tracking-tighter leading-none">
              {sectionTitle}
            </h2>
            <p className="text-3xl font-black text-yellow-400 mb-8 italic">
              {getText(ctaData.sectionSubtitle)}
            </p>
            <div className="w-32 h-6 bg-red-600 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-white/10 backdrop-blur-xl p-12 md:p-16 rounded-[4rem] border border-white/20 shadow-2xl shadow-black/50"
          >
            <p className="text-2xl text-white font-bold leading-relaxed mb-12 italic">
              {getText(ctaData.description)}
            </p>

            <div className="flex flex-col gap-6">
              {ctaData.buttons.map((button, index) => {
                const isPrimary = button.type === 'primary';
                return (
                  <motion.a
                    key={index}
                    href={button.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center justify-center gap-4 px-10 py-6 rounded-full text-lg font-black uppercase tracking-widest transition-all shadow-xl ${
                      isPrimary
                        ? 'bg-yellow-400 text-rose-900 shadow-yellow-500/30'
                        : 'bg-white text-rose-950 shadow-white/10 hover:bg-orange-50'
                    }`}
                  >
                    {isPrimary ? <Phone className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                    {getText(button.text)}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      {/* Tropical Floating Elements (Decorative) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
    </section>
  );
}
