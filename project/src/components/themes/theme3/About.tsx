import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function About() {
  const aboutData = useAboutData();
  const { t } = useLocalize();

  if (!aboutData || !aboutData.features) return null;

  return (
    <section id="about" className="bg-stone-900 text-stone-100">
      {/* Top: Section Header — Large editorial style */}
      <div className="max-w-6xl mx-auto px-8 pt-24 pb-16 border-b border-stone-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-stone-100 font-light leading-[1.1] tracking-wide max-w-lg">
            {t(aboutData, 'sectionTitle')}
          </h2>

        </motion.div>
      </div>

      {/* Features: Large-number editorial vertical list */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        {aboutData.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            className="group grid grid-cols-1 lg:grid-cols-[120px_1fr_1fr] gap-0 lg:gap-12 items-start border-b border-stone-800 py-14 last:border-none hover:border-amber-800/50 transition-colors duration-500"
          >
            {/* Large Number */}
            <div className="font-serif text-8xl leading-none text-stone-700 group-hover:text-amber-800/40 transition-colors duration-700 font-light mb-6 lg:mb-0">
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Image */}
            <div className="overflow-hidden aspect-[3/2] lg:aspect-[4/3] mb-8 lg:mb-0">
              <img
                src={feature.image}
                alt={t(feature, 'title')}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center lg:pl-6">
              <h3 className="font-serif text-3xl text-stone-100 font-light leading-snug tracking-wide mb-6">
                {t(feature, 'title')}
              </h3>
              <div className="w-10 h-px bg-amber-700 mb-6" />
              <p className="font-serif text-stone-400 leading-loose text-base">
                {t(feature, 'description')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
