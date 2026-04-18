import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function CTA() {
  const ctaData = useCTAData();
  const { getText } = useLocalize();

  if (!ctaData) return <SectionError sectionName="CTA" error="No CTA data available" data={ctaData} />;

  const sectionTitle = getText(ctaData.sectionTitle);
  if (!sectionTitle) return <SectionError sectionName="CTA" error="Missing section title" data={ctaData} />;
  if (!ctaData.buttons || !Array.isArray(ctaData.buttons) || ctaData.buttons.length === 0) {
    return <SectionError sectionName="CTA" error="No CTA buttons found." data={ctaData} />;
  }

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-slate-950">
      {/* Background image with dark overlay */}
      {ctaData.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={ctaData.backgroundImage} alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80" />
        </div>
      )}

      {/* Blue glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative line */}
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-8" />

          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            {getText(ctaData.sectionTitle)}
          </h2>
          {ctaData.sectionSubtitle && (
            <p className="text-xl text-blue-400 font-bold mb-4">
              {getText(ctaData.sectionSubtitle)}
            </p>
          )}
          {ctaData.description && (
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {getText(ctaData.description)}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaData.buttons.map((button, index) => (
              <motion.a
                key={index}
                href={button.link}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl ${
                  button.type === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/40'
                    : 'bg-slate-800/80 text-white border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {button.type === 'primary' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                {getText(button.text)}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
