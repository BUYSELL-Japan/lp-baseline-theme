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
    <section id="pricing" className="py-32 px-6 bg-amber-50/50 relative overflow-hidden">
      {/* Sun Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-red-600 fill-current" />
            <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm">Best Value</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-white rounded-[3rem] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col ${
                plan.isPopular ? 'scale-110 md:z-20 border-4 border-yellow-400' : 'md:z-10'
              }`}
            >
              <div className={`h-full rounded-[2.8rem] p-10 flex flex-col ${
                plan.isPopular ? 'bg-gradient-to-b from-yellow-50 to-white' : 'bg-white'
              }`}>
                {plan.isPopular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-yellow-200 px-8 py-3 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-black text-sm uppercase tracking-widest">{translate('popular', language)}</span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-rose-900 mb-2 uppercase tracking-tight">
                    {getText(plan.name)}
                  </h3>
                  <p className="text-sm font-bold text-orange-950/50 min-h-[48px]">
                    {getText(plan.description)}
                  </p>
                </div>

                <div className="mb-10">
                  <div className="text-6xl font-black text-red-600 tracking-tighter italic">
                    {getText(plan.price)}
                  </div>
                  <div className="text-xs font-black text-orange-950/30 mt-2 uppercase tracking-widest">
                    {translate('taxIncluded', language)}
                  </div>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-4 mb-10">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="p-1 bg-red-600 rounded-full mt-1 shrink-0">
                          <Check className="w-3 h-3 text-yellow-200" />
                        </div>
                        <span className="text-sm font-bold text-rose-900/80">{getText(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block w-full text-center px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all ${
                    plan.isPopular
                      ? 'bg-red-600 text-yellow-200 shadow-red-500/30'
                      : 'bg-yellow-400 text-rose-900 shadow-yellow-500/20 hover:bg-yellow-500'
                  }`}
                >
                  {translate('bookingContact', language)}
                </motion.a>
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
