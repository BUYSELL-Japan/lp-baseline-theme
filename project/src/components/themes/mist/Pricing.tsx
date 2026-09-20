import React from 'react';
import { motion } from 'framer-motion';
import { usePricingData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Pricing() {
  const pricingData = usePricingData();
  const { language } = useLanguage();

  if (!pricingData) return <SectionError sectionName="Pricing" error="No pricing data available" />;

  const sectionTitle = getLocalizedValue(pricingData, 'sectionTitle', language);
  const plans = pricingData.plans || [];

  const getFeatureText = (feature: any) => {
    if (typeof feature === 'string') return feature;
    if (feature && typeof feature === 'object') {
      return feature[language] || feature['ja'] || '';
    }
    return String(feature);
  };

  return (
    <section id="pricing" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col text-center p-8 ${plan.isPopular ? 'border border-[#6B8F71] bg-[#F5F5F3]/50' : 'border border-[#EEEEEE] bg-[#FFFFFF]'}`}
            >
              <h3 className="text-base font-sans font-medium text-[#444444] mb-4 tracking-[0.1em]">
                {getLocalizedValue(plan, 'name', language)}
              </h3>
              
              <div className="text-xl font-sans font-light text-[#6B8F71] mb-8 tracking-widest">
                {getLocalizedValue(plan, 'price', language)}
              </div>
              
              <div className="flex flex-col space-y-4 text-[#888888] font-light text-xs tracking-widest flex-1">
                {plan.features?.map((feature, fIndex) => (
                  <div key={fIndex}>{getFeatureText(feature)}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
