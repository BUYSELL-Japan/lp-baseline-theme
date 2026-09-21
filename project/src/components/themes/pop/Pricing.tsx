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

  const rotations = [-2, 1, -1];

  return (
    <section id="pricing" className="relative py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-30">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tight text-[#1a1a1a] mb-2 border-b-8 border-[#FF006E] pb-2 px-2">
              {getText(pricingData.sectionTitle)}
            </h2>
          </motion.div>
          <div className="text-lg md:text-xl text-[#1a1a1a]/80 font-sans font-bold tracking-widest max-w-2xl mx-auto mt-6">
            {getText(pricingData.sectionSubtitle)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {pricingData.plans.map((plan, index) => {
            const rot = rotations[index % rotations.length];
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10, rotate: 0 }}
              style={{ rotate: `${rot}deg` }}
              className={`p-8 md:p-10 flex flex-col h-full border-4 rounded-[24px] shadow-[8px_8px_0_0_#1a1a1a] bg-white text-[#1a1a1a] ${
                plan.isPopular ? 'border-[#FF006E]' : 'border-[#1a1a1a]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FF006E] text-white px-4 py-1 rounded-full font-black text-sm border-2 border-[#1a1a1a] shadow-md">
                  POPULAR!
                </div>
              )}

              <div className="mb-8 text-center mt-4">
                <h3 className="text-2xl font-sans font-black tracking-tight mb-2">
                  {getText(plan.name)}
                </h3>
                <p className="text-sm font-sans font-bold text-[#1a1a1a]/80 leading-relaxed">
                  {getText(plan.description)}
                </p>
              </div>

              <div className="mb-10 text-center">
                <div className="text-4xl font-sans font-black tracking-tight text-[#FB5607]">
                  {getText(plan.price)}
                </div>
                <div className="text-xs font-sans tracking-widest mt-2 text-[#1a1a1a]/60 font-bold">
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-left">
                    <span className="mr-3 mt-1 font-sans font-black text-[#FF006E]">✦</span>
                    <span className="text-sm font-sans font-bold leading-relaxed text-[#1a1a1a]">
                      {getText(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="w-full py-4 text-center font-sans font-black tracking-tight text-lg transition-transform duration-300 rounded-xl border-2 border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white hover:translate-y-1 hover:shadow-[0px_0px_0_0_#1a1a1a]"
              >
                {translate('bookingContact', language)}
              </a>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
