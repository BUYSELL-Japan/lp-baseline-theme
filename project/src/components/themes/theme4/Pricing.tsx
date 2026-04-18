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

  const sectionTitle = getText(pricingData.sectionTitle);
  const sectionSubtitle = getText(pricingData.sectionSubtitle);

  return (
    <section id="pricing" className="py-32 px-6 bg-red-50/10 relative overflow-hidden">
      {/* Decorative Sun */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400 opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-right"
        >
          <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-6 italic tracking-tighter leading-none">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-black text-red-900/40 italic">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex-1 flex flex-col ${
                plan.isPopular ? 'lg:scale-110 lg:z-20' : 'lg:z-10 opacity-90'
              }`}
            >
              <div className={`h-full rounded-[4rem] p-1 shadow-2xl ${
                plan.isPopular ? 'bg-gradient-to-br from-red-600 to-orange-500' : 'bg-white'
              }`}>
                <div className="bg-white h-full rounded-[3.8rem] p-10 md:p-12 flex flex-col">
                  {plan.isPopular && (
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-yellow-200 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                        <Star className="w-4 h-4 fill-current" />
                        {translate('popular', language)}
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-red-950 uppercase tracking-tighter italic">
                      {getText(plan.name)}
                    </h3>
                  </div>

                  <div className="mb-10">
                    <div className="text-7xl font-black text-red-600 tracking-tighter italic leading-none">
                      {getText(plan.price)}
                    </div>
                    <div className="text-[10px] font-black text-red-950/30 mt-4 uppercase tracking-[0.2em]">
                      {translate('taxIncluded', language)}
                    </div>
                  </div>

                  <div className="flex-grow space-y-6 mb-12">
                    <p className="text-sm font-bold text-red-950/50">
                      {getText(plan.description)}
                    </p>
                    <div className="h-px bg-yellow-100" />
                    <ul className="space-y-4">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <Check className="w-5 h-5 text-red-600 shrink-0" />
                          <span className="text-base font-bold text-red-950/80">{getText(feature)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`block w-full text-center px-8 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl transition-all ${
                      plan.isPopular
                        ? 'bg-red-600 text-yellow-400 shadow-red-500/30'
                        : 'bg-yellow-400 text-red-900 shadow-yellow-500/20 hover:bg-yellow-500'
                    }`}
                  >
                    {translate('bookingContact', language)}
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {pricingData.note && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-16 text-sm font-bold text-orange-950/40 italic"
          >
            * {getText(pricingData.note)}
          </motion.div>
        )}
      </div>
    </section>
  );
}
