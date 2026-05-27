import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { usePricingData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/i18n';
import SectionError from './SectionError';

export default function Pricing() {
  const pricingData = usePricingData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  console.log('[Pricing] pricingData:', pricingData);

  if (!pricingData) {
    console.log('[Pricing] No pricingData');
    return <SectionError sectionName="Pricing" error="No pricing data available" data={pricingData} />;
  }

  const sectionTitle = getText(pricingData.sectionTitle);
  const sectionSubtitle = getText(pricingData.sectionSubtitle);

  console.log('[Pricing] sectionTitle:', sectionTitle);
  console.log('[Pricing] plans:', pricingData.plans);

  if (!sectionTitle) {
    return <SectionError sectionName="Pricing" error="Missing section title" data={pricingData} />;
  }

  if (!pricingData.plans || !Array.isArray(pricingData.plans) || pricingData.plans.length === 0) {
    console.log('[Pricing] Missing plans array');
    return <SectionError sectionName="Pricing" error="No pricing plans found. Expected 'plans' array in data." data={pricingData} />;
  }

  return (
    <section id="pricing" className="py-24 px-4 bg-section-gradient">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-theme-divider mx-auto mb-6" />
          <p className="text-xl text-gray-700">{sectionSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
                plan.isPopular ? 'ring-4 ring-theme-primary' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-theme-primary text-white px-6 py-2 rounded-bl-2xl">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{translate('popular', language)}</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {getText(plan.name)}
                </h3>
                <p className="text-gray-600 text-sm mb-6 min-h-[40px]">
                  {getText(plan.description)}
                </p>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-theme-primary">
                    {getText(plan.price)}
                  </div>
                  <div className="text-sm text-gray-500">{translate('taxIncluded', language)}</div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <ul className="space-y-3">
                    {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-theme-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{getText(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-8 pb-8">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full text-center px-6 py-3 rounded-xl font-bold transition-all ${
                    plan.isPopular
                      ? 'bg-theme-primary text-white hover:bg-theme-primary-hover'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-sm text-gray-600"
          >
            {getText(pricingData.note)}
          </motion.div>
        )}
      </div>
    </section>
  );
}
