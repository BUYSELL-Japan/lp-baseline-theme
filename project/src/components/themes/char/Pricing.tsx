import React from 'react';
import { usePricingData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Pricing() {
  const pricingData = usePricingData();
  const { language } = useLanguage();

  if (!pricingData) return <SectionError sectionName="Pricing" error="No pricing data available" />;
  if (!pricingData.plans || pricingData.plans.length === 0) return null;

  const sectionTitle = getLocalizedValue(pricingData, 'sectionTitle', language);
  const plans = pricingData.plans;

  const getFeatureText = (feature: any): string => {
    if (typeof feature === 'string') return feature;
    if (feature && typeof feature === 'object') {
      return feature[language] || feature['ja'] || '';
    }
    return String(feature);
  };

  return (
    <section id="pricing" className="scroll-mt-20 py-32 md:py-48 px-6" style={{ backgroundColor: '#111111', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'PRICING'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const name = getLocalizedValue(plan, 'name', language);
            const description = getLocalizedValue(plan, 'description', language);
            const price = getLocalizedValue(plan, 'price', language);
            const features = plan.features || [];
            const isPopular = plan.isPopular;

            return (
              <div
                key={index}
                className="flex flex-col p-10 relative"
                style={{
                  backgroundColor: isPopular ? '#1A1A1A' : '#111111',
                  border: '2px solid #D4541A',
                }}
              >
                {isPopular && (
                  <div
                    className="absolute top-0 right-0 font-sans text-xs tracking-[0.2em] uppercase px-4 py-2"
                    style={{ fontFamily: 'monospace', backgroundColor: '#D4541A', color: '#FFFFFF', fontWeight: 700 }}
                  >
                    POPULAR
                  </div>
                )}
                <h3
                  className="font-sans font-black text-[#FFFFFF] text-[2rem] md:text-[3rem] mb-4 tracking-[0.1em]"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, marginTop: isPopular ? '1rem' : '0' }}
                >
                  {name}
                </h3>
                <p className="font-sans text-sm text-[#BBBBBB] tracking-wider mb-8 leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {description}
                </p>
                <div
                  className="font-sans font-black text-[2rem] md:text-[3rem] mb-10"
                  style={{ fontFamily: 'monospace', fontWeight: 700, color: '#D4541A' }}
                >
                  {price}
                </div>
                <div className="flex flex-col space-y-4 flex-1 mt-auto pt-8" style={{ borderTop: '1px solid rgba(212, 84, 26, 0.3)' }}>
                  {features.map((feature, fIndex) => (
                    <div
                      key={fIndex}
                      className="font-sans text-sm text-[#BBBBBB] tracking-wider"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {'> '}{getFeatureText(feature)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {pricingData.note && (
          <p className="mt-12 font-sans text-sm text-[#BBBBBB] tracking-wider" style={{ fontFamily: 'monospace' }}>
            * {getLocalizedValue(pricingData, 'note', language)}
          </p>
        )}
      </div>
    </section>
  );
}
