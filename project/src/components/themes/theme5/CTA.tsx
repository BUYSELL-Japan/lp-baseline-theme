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
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      {/* Full-width image background - offset to right */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2">
        <img
          src={ctaData.backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-950/70" />
      </div>

      {/* Left content block */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch min-h-[400px]">

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 pr-0 lg:pr-20 py-16 lg:py-0 flex flex-col justify-center relative z-10"
          >
            {/* Red noren accent */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C0392B]" />
            <div className="pl-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Contact</span>
                <div className="w-8 h-px bg-[#D4AF37]" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                {sectionTitle}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed font-medium mb-10">
                {getText(ctaData.sectionSubtitle)}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {getText(ctaData.description)}
              </p>
            </div>
          </motion.div>

          {/* Buttons side - overlapping dark zone */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 py-16 lg:py-0 flex flex-col justify-center px-0 lg:px-16 relative z-20"
          >
            <div className="flex flex-col gap-4">
              {ctaData.buttons.map((button, index) => {
                const isPrimary = button.type === 'primary';
                return (
                  <a
                    key={index}
                    href={button.link}
                    className={`inline-flex items-center gap-4 px-8 py-5 text-sm font-black uppercase tracking-[0.15em] border transition-all ${
                      isPrimary
                        ? 'bg-[#D4AF37] text-gray-950 border-[#D4AF37] hover:bg-[#C9A227]'
                        : 'bg-transparent text-white border-white hover:bg-white hover:text-gray-950'
                    }`}
                  >
                    {isPrimary ? <Phone className="w-5 h-5 shrink-0" /> : <Mail className="w-5 h-5 shrink-0" />}
                    {getText(button.text)}
                  </a>
                );
              })}
            </div>

            {/* Cymbal disc decoration */}
            <div className="mt-12 flex items-center gap-4 opacity-40">
              <div className="w-16 h-16 border-2 border-[#D4AF37] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border border-[#D4AF37] rounded-full" />
              </div>
              <div className="w-10 h-px bg-[#D4AF37]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
