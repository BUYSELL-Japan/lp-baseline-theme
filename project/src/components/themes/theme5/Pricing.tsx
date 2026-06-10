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

  const sectionTitle = getText(pricingData.sectionTitle);
  const sectionSubtitle = getText(pricingData.sectionSubtitle);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-950 relative overflow-hidden">
      {/* Concrete texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 6px
          )`
        }}
      />

      {/* Gold horizontal rule top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />

      {/* Cymbal disc decorative circles */}
      <div className="absolute right-12 top-12 w-48 h-48 border border-[#D4AF37]/15 rounded-full pointer-events-none" />
      <div className="absolute right-20 top-20 w-32 h-32 border border-[#D4AF37]/25 rounded-full pointer-events-none" />
      <div className="absolute right-28 top-28 w-16 h-16 border border-[#D4AF37]/40 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16 lg:text-right"
        >
          <div className="flex items-center gap-4 mb-4 lg:justify-end">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Pricing</span>
            <div className="w-0.5 h-10 bg-[#C0392B]" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-none tracking-tight">
            {sectionTitle}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-3 tracking-wider">
            {sectionSubtitle}
          </p>
          <div className="mt-4 flex items-center gap-2 lg:justify-end">
            <div className="w-2 h-px bg-[#C0392B]" />
            <div className="w-16 h-0.5 bg-[#D4AF37]" />
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-700">
          {pricingData.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col p-10 relative ${
                plan.isPopular
                  ? 'bg-[#D4AF37]'
                  : 'bg-gray-900'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#C0392B] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5">
                    {translate('popular', language)}
                  </div>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-8">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-1 ${
                  plan.isPopular ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {getText(plan.name)}
                </h3>
                <div className={`w-8 h-0.5 ${plan.isPopular ? 'bg-gray-900' : 'bg-[#D4AF37]'}`} />
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className={`text-5xl font-black tracking-tighter leading-none ${
                  plan.isPopular ? 'text-gray-950' : 'text-white'
                }`}>
                  {getText(plan.price)}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ${
                  plan.isPopular ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {translate('taxIncluded', language)}
                </div>
              </div>

              {/* Description & features */}
              <div className="flex-grow mb-10">
                <p className={`text-sm mb-6 leading-relaxed ${
                  plan.isPopular ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {getText(plan.description)}
                </p>
                <div className={`w-full h-px mb-6 ${plan.isPopular ? 'bg-gray-900/20' : 'bg-gray-700'}`} />
                <ul className="space-y-3">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.isPopular ? 'text-gray-900' : 'text-[#D4AF37]'
                      }`} />
                      <span className={`text-sm font-medium ${
                        plan.isPopular ? 'text-gray-900' : 'text-gray-300'
                      }`}>{getText(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className={`block w-full text-center px-6 py-4 text-xs font-black uppercase tracking-[0.2em] border transition-all ${
                  plan.isPopular
                    ? 'bg-gray-950 text-[#D4AF37] border-gray-950 hover:bg-gray-800'
                    : 'bg-transparent text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37] hover:text-gray-950'
                }`}
              >
                {translate('bookingContact', language)}
              </a>
            </motion.div>
          ))}
        </div>

        {pricingData.note && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-10 text-xs font-medium text-gray-600"
          >
            * {getText(pricingData.note)}
          </motion.div>
        )}
      </div>

      {/* Gold bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
    </section>
  );
}
