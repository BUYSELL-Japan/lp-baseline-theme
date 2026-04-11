import React from 'react';
import { motion } from 'framer-motion';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function CTA() {
  const ctaData = useCTAData();
  const { getText } = useLocalize();

  if (!ctaData || !ctaData.buttons) return null;

  return (
    <section className="relative py-40 overflow-hidden bg-stone-900">
      {/* Full-bleed background */}
      {ctaData.backgroundImage && (
        <>
          <img
            src={ctaData.backgroundImage}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/80" />
        </>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="w-8 h-px bg-amber-400 mx-auto mb-10" />
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light tracking-wider leading-tight mb-6">
            {getText(ctaData.sectionTitle)}
          </h2>
          <p className="font-serif text-stone-300 text-lg leading-loose mb-4 font-light">
            {getText(ctaData.sectionSubtitle)}
          </p>
          <p className="font-serif text-stone-400 text-base leading-loose mb-16 font-light max-w-xl mx-auto">
            {getText(ctaData.description)}
          </p>
          <div className="w-8 h-px bg-amber-400 mx-auto mb-16" />

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {ctaData.buttons.map((button, index) => (
              <motion.a
                key={index}
                href={button.link}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-12 py-5 font-serif text-sm tracking-[0.25em] uppercase transition-all duration-500 ${
                  button.type === 'primary'
                    ? 'bg-amber-700 text-white hover:bg-amber-600'
                    : 'border border-white/40 text-white hover:border-white hover:bg-white/10'
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
