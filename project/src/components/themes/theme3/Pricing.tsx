import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { usePricingData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';

export default function Pricing() {
  const pricingData = usePricingData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  if (!pricingData || !pricingData.plans) return null;

  return (
    <section id="pricing" className="py-32 px-8 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <div className="w-8 h-px bg-amber-700 mx-auto mb-8" />
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 font-light tracking-wider mb-3">
            {getText(pricingData.sectionTitle)}
          </h2>
          <p className="font-serif text-stone-500 text-lg tracking-wider font-light">
            {getText(pricingData.sectionSubtitle)}
          </p>
          <div className="w-8 h-px bg-amber-700 mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`relative p-10 flex flex-col h-full transition-all duration-500 ${
                plan.isPopular
                  ? 'bg-amber-800 text-white shadow-xl shadow-amber-900/20'
                  : 'bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              {/* Decorative corner */}
              <div className={`absolute top-3 left-3 w-8 h-8 border-t border-l ${plan.isPopular ? 'border-amber-600/40' : 'border-amber-700/30'}`} />
              <div className={`absolute bottom-3 right-3 w-8 h-8 border-b border-r ${plan.isPopular ? 'border-amber-600/40' : 'border-amber-700/30'}`} />

              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-serif tracking-[0.2em] uppercase px-6 py-1.5">
                  Recommended
                </span>
              )}

              <h3 className={`font-serif text-2xl font-light tracking-wide mb-2 ${plan.isPopular ? 'text-amber-100' : 'text-stone-800'}`}>
                {getText(plan.name)}
              </h3>
              <p className={`font-serif text-sm leading-relaxed mb-8 ${plan.isPopular ? 'text-amber-200/70' : 'text-stone-500'}`}>
                {getText(plan.description)}
              </p>

              <div className="mb-10">
                <div className={`font-serif text-4xl font-light tracking-tight ${plan.isPopular ? 'text-white' : 'text-amber-800'}`}>
                  {getText(plan.price)}
                </div>
                <div className={`text-xs font-serif tracking-widest mt-1 ${plan.isPopular ? 'text-amber-200/60' : 'text-stone-400'}`}>
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-3.5 mb-10 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className={`flex items-start gap-3 font-serif text-sm ${plan.isPopular ? 'text-amber-100/80' : 'text-stone-600'}`}>
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.isPopular ? 'text-amber-300' : 'text-amber-700'}`} />
                    {getText(feature)}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`w-full py-4 font-serif text-sm tracking-[0.2em] uppercase text-center transition-all duration-500 ${
                  plan.isPopular
                    ? 'bg-white text-amber-800 hover:bg-amber-50'
                    : 'border border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white'
                }`}
              >
                {translate('bookingContact', language)}
              </a>
            </motion.div>
          ))}
        </div>

        {pricingData.note && (
          <p className="text-center font-serif text-sm text-stone-400 mt-12 tracking-wide">
            {getText(pricingData.note)}
          </p>
        )}
      </div>
    </section>
  );
}
