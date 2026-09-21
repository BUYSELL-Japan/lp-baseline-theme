import React from 'react';
import { motion } from 'framer-motion';

import { usePricingData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';

export default function Pricing() {
  const pricingData = usePricingData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  if (!pricingData || !pricingData.plans || pricingData.plans.length === 0) return null;
  if (!getText(pricingData.sectionTitle)) return null;

  return (
    <section id="pricing" className="py-32 md:py-48 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-32"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-[0.2em] mb-8">
            {getText(pricingData.sectionTitle)}
          </h2>
          <div className="text-lg md:text-xl text-[#2D2D2D] font-sans font-light tracking-widest max-w-2xl mx-auto">
            {getText(pricingData.sectionSubtitle)}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4) }}
              className={`p-10 flex flex-col h-full border ${
                plan.isPopular
                  ? 'bg-[#C0392B] text-white border-[#C0392B] shadow-2xl scale-100 md:scale-105 z-10'
                  : 'bg-[#FFFFFF] text-[#1a1a1a] border-[#E5E5E5]'
              }`}
            >
              <div className="mb-10 text-center">
                <h3 className={`text-2xl font-serif tracking-widest mb-4 ${plan.isPopular ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {getText(plan.name)}
                </h3>
                <p className={`text-sm font-sans font-light leading-loose ${plan.isPopular ? 'text-white/80' : 'text-[#2D2D2D]'}`}>
                  {getText(plan.description)}
                </p>
              </div>

              <div className="mb-12 text-center">
                <div className={`text-4xl font-serif tracking-widest ${plan.isPopular ? 'text-white' : 'text-[#C0392B]'}`}>
                  {getText(plan.price)}
                </div>
                <div className={`text-xs font-sans tracking-widest mt-4 ${plan.isPopular ? 'text-white/70' : 'text-[#2D2D2D]/70'}`}>
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-6 mb-12 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-left">
                    <span className="mr-4 mt-1 font-serif text-sm">・</span>
                    <span className={`text-sm font-sans leading-loose ${plan.isPopular ? 'text-white' : 'text-[#2D2D2D]'}`}>
                      {getText(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-4 text-center font-serif tracking-widest text-sm transition-colors duration-300 ${
                  plan.isPopular 
                    ? 'bg-white text-[#C0392B] hover:bg-[#F5F0E8]' 
                    : 'bg-[#1a1a1a] text-white hover:bg-[#2D2D2D]'
                }`}
              >
                {translate('bookingContact', language)}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
