import React from 'react';
import { motion } from 'framer-motion';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function About() {
  const aboutData = useAboutData();
  const { t } = useLocalize();

  if (!aboutData || !aboutData.features) return null;

  return (
    <section id="about" className="py-32 px-6 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-8">
              {t(aboutData, 'sectionTitle')}
            </h2>
            <div className="w-20 h-2 bg-blue-600 mb-12" />
          </motion.div>

          <div className="space-y-12">
            {aboutData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="w-full md:w-40 h-40 shrink-0 overflow-hidden rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={feature.image} alt={t(feature, 'title')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                    {t(feature, 'title')}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {t(feature, 'description')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
