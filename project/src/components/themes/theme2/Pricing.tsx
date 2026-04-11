import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
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
    <section id="pricing" className="py-32 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-4 block">
            Pricing Plans
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            {getText(pricingData.sectionTitle)}
          </h2>
          <div className="w-20 h-2 bg-blue-600 mx-auto mb-8" />
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
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
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-[2.5rem] flex flex-col h-full overflow-hidden transition-all duration-500 ${
                plan.isPopular 
                  ? 'bg-blue-600 scale-105 shadow-[0_0_80px_rgba(37,99,235,0.3)] z-10' 
                  : 'bg-slate-800/50 border border-slate-700 hover:border-blue-500/50'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-8 right-8 text-white/50">
                  <Zap className="w-12 h-12 fill-current opacity-20 rotate-12" />
                </div>
              )}

              <div className="mb-10 relative">
                <h3 className={`text-2xl font-black mb-2 tracking-tight ${plan.isPopular ? 'text-white' : 'text-slate-100'}`}>
                  {getText(plan.name)}
                </h3>
                <p className={`text-sm font-medium ${plan.isPopular ? 'text-blue-100' : 'text-slate-400'}`}>
                  {getText(plan.description)}
                </p>
              </div>

              <div className="mb-10">
                <div className={`text-5xl font-black tracking-tighter ${plan.isPopular ? 'text-white' : 'text-blue-500'}`}>
                  {getText(plan.price)}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest mt-2 ${plan.isPopular ? 'text-blue-200' : 'text-slate-500'}`}>
                  {translate('taxIncluded', language)}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.isPopular ? 'bg-white/20' : 'bg-blue-500/10 text-blue-500'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-medium leading-tight ${plan.isPopular ? 'text-white' : 'text-slate-300'}`}>
                      {getText(feature)}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-5 rounded-2xl font-black text-center transition-all ${
                  plan.isPopular 
                    ? 'bg-white text-blue-600 hover:bg-slate-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
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
