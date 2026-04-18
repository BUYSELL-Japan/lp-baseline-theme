import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import type { AboutFeature } from '../../../data/types';

function FeatureCard({ feature, index }: { feature: AboutFeature; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLocalize();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`relative flex flex-col items-center gap-12 mb-48 lg:mb-64 ${
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Image Block with Decorative Element */}
      <div className="w-full lg:w-3/5 relative">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative z-10 overflow-hidden rounded-[4rem] shadow-2xl bg-white p-3 rotate-1 group"
        >
          <img
            src={feature.image}
            alt={t(feature, 'title')}
            className="w-full h-[500px] object-cover rounded-[3.5rem] transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
        
        {/* Abstract Floating Shapes behind image */}
        <div className={`absolute -inset-10 rounded-full blur-3xl opacity-20 -z-10 ${
          index % 2 === 0 ? 'bg-yellow-300 translate-x-10' : 'bg-red-400 -translate-x-10'
        }`} />
      </div>

      {/* Text Block - Overlapping */}
      <div className={`w-full lg:w-2/5 lg:absolute ${
        index % 2 === 0 ? 'lg:-right-12' : 'lg:-left-12'
      } z-20 bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-red-50`}>
        <h3 className="text-3xl md:text-5xl font-black text-red-950 mb-6 leading-tight italic tracking-tighter">
          {t(feature, 'title')}
        </h3>
        <p className="text-lg md:text-xl font-bold text-red-950/70 leading-relaxed">
          {t(feature, 'description')}
        </p>
        <div className="mt-8 flex gap-2">
          <div className="w-16 h-2 bg-red-600 rounded-full" />
          <div className="w-4 h-2 bg-yellow-400 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const aboutData = useAboutData();
  const { t } = useLocalize();

  if (!aboutData || !aboutData.features) return null;

  return (
    <section id="about" className="py-32 px-6 bg-red-50/30 relative overflow-hidden">
      {/* Background Text Decor - Removed to simplify UX */}

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-32 max-w-2xl"
        >
          <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-8 italic tracking-tighter leading-none">
            {t(aboutData, 'sectionTitle')}
          </h2>
          <div className="w-24 h-4 bg-red-600 rounded-full shadow-lg" />
        </motion.div>

        <div className="relative">
          {aboutData.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
