import React from 'react';
import { motion } from 'framer-motion';

import { usePricingData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Pricing() {
  const pricingData = usePricingData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  if (!pricingData || !pricingData.plans) return <SectionError sectionName="Pricing" error="No pricing data available" data={pricingData} />;

  return (
    <section id="pricing" className="bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {getText(pricingData.sectionTitle)}
          </h2>
          <p className="text-base text-[#333333]">{getText(pricingData.sectionSubtitle)}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 flex flex-col h-full border ${
                plan.isPopular
                  ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                  : 'bg-[#F8F8F8] border-[#E5E5E5] text-[#333333]'
              }`}
            >
              <div className="mb-8 border-b border-current/20 pb-6">
                <h3 className="text-2xl font-sans font-bold mb-3">
                  {getText(plan.name)}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {getText(plan.description)}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-3xl font-sans font-bold">
                  {getText(plan.price)}
                </div>
                <div className="text-xs opacity-80 mt-2">
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-left text-sm">
                    <span className="mr-3 font-bold">・</span>
                    <span className="leading-relaxed opacity-90">
                      {getText(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-4 text-center font-sans font-bold text-sm transition-colors ${
                  plan.isPopular 
                    ? 'bg-white text-[#2D6A4F] hover:bg-[#F8F8F8]' 
                    : 'bg-[#333333] text-white hover:bg-[#1a1a1a]'
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
