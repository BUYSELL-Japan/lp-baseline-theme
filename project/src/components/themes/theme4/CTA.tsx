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
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ctaData.backgroundImage}
          alt="Background"
          className="w-full h-full object-cover scale-110 blur-sm brightness-75 transition-all duration-[20s] animate-pulse"
        />
        {/* Dynamic Tropical Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/90 via-orange-500/80 to-yellow-400/70 mix-blend-multiply" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-1 bg-white/40 rounded-full" />
            <span className="text-white font-black uppercase tracking-[0.4em] text-xs">Join the Paradise</span>
            <div className="w-12 h-1 bg-white/40 rounded-full" />
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 italic tracking-tighter drop-shadow-2xl">
            {sectionTitle}
          </h2>
          
          <p className="text-2xl md:text-3xl font-bold text-yellow-200 mb-6 drop-shadow-lg">
            {getText(ctaData.sectionSubtitle)}
          </p>
          
          <p className="text-xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed font-bold italic">
            {getText(ctaData.description)}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {ctaData.buttons.map((button, index) => {
              const isPrimary = button.type === 'primary';
              return (
                <motion.a
                  key={index}
                  href={button.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center gap-4 px-12 py-6 rounded-full text-lg font-black uppercase tracking-widest transition-all shadow-2xl ${
                    isPrimary
                      ? 'bg-yellow-400 text-rose-900 shadow-yellow-500/40 hover:bg-yellow-300'
                      : 'bg-white text-red-600 shadow-white/20 hover:bg-red-50'
                  }`}
                >
                  {isPrimary ? (
                    <Phone className="w-6 h-6" />
                  ) : (
                    <Mail className="w-6 h-6" />
                  )}
                  {getText(button.text)}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Tropical Floating Elements (Decorative) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
    </section>
  );
}
