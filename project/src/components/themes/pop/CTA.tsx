import { motion } from 'framer-motion';

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
    <section className="bg-gradient-to-br from-[#FF006E] to-[#FB5607] relative py-16 sm:py-16 md:py-24 md:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background image with dark overlay */}
      {ctaData.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={ctaData.backgroundImage} alt="Background" className="w-full h-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#0a0a0a]/50 to-slate-950/75" />
        </div>
      )}

      {/* Blue glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7B2FBE]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7B2FBE]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative line */}
          <div className="w-16 h-1 bg-[#7B2FBE] mx-auto mb-8" />

          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-white tracking-tighter mb-6 border-b-8 border-white pb-4 inline-block mb-4">
            {getText(ctaData.sectionTitle)}
          </h2>
          {ctaData.sectionSubtitle && (
            <p className="text-xl text-[#FB5607] font-sans font-black tracking-tight mb-4">
              {getText(ctaData.sectionSubtitle)}
            </p>
          )}
          {ctaData.description && (
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
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
                className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-sans font-black tracking-tight transition-all shadow-2xl ${
                  button.type === 'primary'
                    ? 'bg-[#7B2FBE] text-white hover:bg-[#7B2FBE] shadow-[#1a1a1a]/30'
                    : 'bg-[#F5F0E8]/80 text-white border border-[#FFBE0B]/30 hover:bg-[#FFFFFF]'
                }`}
              >
                
                {getText(button.text)}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
