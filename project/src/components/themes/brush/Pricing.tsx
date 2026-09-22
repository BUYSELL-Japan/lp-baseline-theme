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
    <section id="pricing" className="scroll-mt-20 bg-[#1a1a1a] text-white py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-black tracking-widest text-white mb-6">
            {getText(pricingData.sectionTitle)}
          </h2>
          <div className="w-24 h-2 bg-[#C0392B] mx-auto mb-6" />
          <div className="text-lg md:text-xl text-[#E5E5E5] font-serif font-bold tracking-widest max-w-2xl mx-auto">
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
                  : 'bg-[#F5F0E8] text-[#1a1a1a] border-[#1a1a1a]'
              }`}
            >
              <div className="mb-10 text-center border-b border-current/20 pb-8">
                <h3 className="text-3xl font-serif font-black tracking-widest mb-4">
                  {getText(plan.name)}
                </h3>
                <p className={`text-base font-serif font-bold leading-loose ${plan.isPopular ? 'text-white/90' : 'text-[#1a1a1a]/80'}`}>
                  {getText(plan.description)}
                </p>
              </div>

              <div className="mb-12 text-center">
                <div className="text-4xl md:text-5xl font-serif font-black tracking-widest">
                  {getText(plan.price)}
                </div>
                <div className={`text-xs font-serif tracking-widest mt-4 ${plan.isPopular ? 'text-white/70' : 'text-[#1a1a1a]/60'}`}>
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-6 mb-12 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-left">
                    <span className="mr-4 mt-1 font-serif text-sm">・</span>
                    <span className="text-base font-serif font-bold leading-loose">
                      {getText(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-5 text-center font-serif font-black tracking-widest text-lg transition-colors duration-300 ${
                  plan.isPopular 
                    ? 'bg-white text-[#C0392B] hover:bg-[#F5F0E8]' 
                    : 'bg-[#1a1a1a] text-white hover:bg-[#C0392B]'
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
