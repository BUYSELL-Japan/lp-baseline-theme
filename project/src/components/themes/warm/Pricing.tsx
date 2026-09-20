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

  if (!pricingData || !pricingData.plans) return null;
  if (!getText(pricingData.sectionTitle)) return null;

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-white border-t border-[#D97706]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-normal font-bold tracking-wide text-[#1C1917] tracking-tighter mb-6 border-b-2 border-[#D97706] pb-4 inline-block mb-4">
            {getText(pricingData.sectionTitle)}
          </h2>
          <div className="w-20 h-2 bg-[#92400E] mx-auto mb-8" />
          <p className="text-xl text-[#1C1917] font-medium max-w-2xl mx-auto">
            {getText(pricingData.sectionSubtitle)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              className={`relative p-8 rounded-[2.5rem] flex flex-col h-full overflow-hidden transition-all duration-500 ${
                plan.isPopular
                  ? 'bg-[#92400E] scale-105 shadow-[0_0_80px_rgba(37,99,235,0.25)] z-10'
                  : 'bg-white border border-[#D97706]/30 hover:border-[#D97706] hover:shadow-lg'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-8 right-8 text-[#1C1917]/50">
                  
                </div>
              )}

              <div className="mb-10 relative">
                <h3 className={`text-2xl font-sans font-bold tracking-normal font-bold tracking-wide mb-2 tracking-tight ${plan.isPopular ? 'text-[#1C1917]' : 'text-[#1C1917]'}`}>
                  {getText(plan.name)}
                </h3>
                <p className={`text-sm font-medium ${plan.isPopular ? 'text-[#1C1917]' : 'text-[#1C1917]'}`}>
                  {getText(plan.description)}
                </p>
              </div>

              <div className="mb-10">
                <div className={`text-5xl font-sans font-bold tracking-normal font-bold tracking-wide tracking-tighter ${plan.isPopular ? 'text-[#1C1917]' : 'text-[#D97706]'}`}>
                  {getText(plan.price)}
                </div>
                <div className={`text-xs font-sans font-bold tracking-normal font-bold uppercase tracking-widest mt-2 ${plan.isPopular ? 'text-[#1C1917]' : 'text-amber-900/80'}`}>
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.isPopular ? 'bg-[#92400E]/20' : 'bg-[#FFFBF0] text-[#D97706]'}`}>
                      
                    </div>
                    <span className={`text-sm font-medium leading-tight ${plan.isPopular ? 'text-[#1C1917]' : 'text-[#1C1917]'}`}>
                      {getText(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-5 rounded-2xl font-sans font-bold tracking-normal font-bold tracking-wide text-center transition-all ${
                  plan.isPopular 
                    ? 'bg-white text-[#D97706] hover:bg-[#FFFBF0]' 
                    : 'bg-[#92400E] text-white hover:bg-[#92400E] shadow-lg shadow-[#92400E]/30'
                }`}
              >
                {translate('bookingContact', language)}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
