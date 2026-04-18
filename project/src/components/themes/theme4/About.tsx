import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import type { AboutFeature } from '../../../data/types';

function FeatureCard({ feature, index }: { feature: AboutFeature; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;
  const { t } = useLocalize();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 mb-32 relative group`}
    >
      <div className="w-full md:w-1/2 relative">
        <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(234,88,12,0.15)] bg-white p-3">
          <motion.img
            src={feature.image}
            alt={t(feature, 'title')}
            className="w-full h-96 object-cover rounded-[2rem]"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8 }}
          />
        </div>
        {/* Abstract Background Shape */}
        <div className={`absolute -inset-4 rounded-[3rem] ${isEven ? 'bg-yellow-200' : 'bg-red-100'} -z-10 group-hover:scale-105 transition-transform duration-500 opacity-50`} />
      </div>

      <div className="w-full md:w-1/2 space-y-6">
        <div className="inline-block px-4 py-1 rounded-full bg-red-600/10 text-red-600 text-xs font-black uppercase tracking-widest">
          Feature {index + 1}
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-rose-900 leading-tight">
          {t(feature, 'title')}
        </h3>
        <p className="text-xl text-orange-950/70 leading-relaxed font-bold">
          {t(feature, 'description')}
        </p>
        <div className={`w-20 h-2 ${isEven ? 'bg-yellow-400' : 'bg-red-500'} rounded-full`} />
      </div>
    </motion.div>
  );
}

export default function About() {
  const aboutData = useAboutData();
  const { t } = useLocalize();

  if (!aboutData || !aboutData.features) return null;

  return (
    <section id="about" className="py-32 px-6 bg-amber-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Discover Us</span>
          <h2 className="text-5xl md:text-7xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {t(aboutData, 'sectionTitle')}
          </h2>
          <div className="flex justify-center gap-2">
            <div className="w-12 h-1.5 bg-red-600 rounded-full" />
            <div className="w-4 h-1.5 bg-yellow-400 rounded-full" />
          </div>
        </motion.div>

        <div className="space-y-32">
          {aboutData.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
