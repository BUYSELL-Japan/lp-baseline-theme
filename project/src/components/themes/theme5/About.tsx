import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useAboutData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import type { AboutFeature } from '../../../data/types';

function FeatureCard({ feature, index }: { feature: AboutFeature; index: number }) {
  const { t } = useLocalize();
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch gap-0 mb-16 lg:mb-24`}
    >
      {/* Image */}
      <div className="w-full lg:w-3/5 overflow-hidden relative">
        <motion.img
          src={feature.image}
          alt={t(feature, 'title')}
          className="w-full h-72 lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
          whileHover={{ scale: 1.03 }}
        />
        {/* Gold corner accent */}
        <div className={`absolute top-0 w-12 h-12 border-t-2 border-[#D4AF37] ${isEven ? 'right-0 border-r-2' : 'left-0 border-l-2'}`} />
        <div className={`absolute bottom-0 w-12 h-12 border-b-2 border-[#D4AF37] ${isEven ? 'left-0 border-l-2' : 'right-0 border-r-2'}`} />
      </div>

      {/* Text panel */}
      <div className={`w-full lg:w-2/5 bg-white border border-gray-200 ${isEven ? 'border-l-0' : 'border-r-0'} p-10 lg:p-14 flex flex-col justify-center relative`}>
        {/* Red accent line */}
        <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} bottom-0 w-0.5 bg-[#C0392B]`} />

        {/* Index number watermark */}
        <span className="text-[5rem] font-black text-gray-100 leading-none absolute top-6 right-6 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative z-10">
          <div className="w-6 h-px bg-[#D4AF37] mb-6" />
          <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
            {t(feature, 'title')}
          </h3>
          <p className="text-base text-gray-600 leading-relaxed font-medium">
            {t(feature, 'description')}
          </p>
          <div className="mt-8 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#D4AF37]" />
            <div className="w-2 h-0.5 bg-[#C0392B]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const aboutData = useAboutData();
  const { t, translate } = useLocalize();

  if (!aboutData || !aboutData.features) return null;

  return (
    <section id="about" className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-0.5 h-10 bg-[#C0392B]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{translate('sectionAbout')}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
            {t(aboutData, 'sectionTitle')}
          </h2>
          <div className="mt-4 w-16 h-0.5 bg-[#D4AF37]" />
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
