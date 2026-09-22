import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePricingData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Pricing() {
  const pricingData = usePricingData();
  const { language } = useLanguage();
  const { getText } = useLocalize();
  const [activeTab, setActiveTab] = useState(0);

  if (!pricingData || !pricingData.plans || pricingData.plans.length === 0) return null;
  const sectionTitle = getLocalizedValue(pricingData, 'sectionTitle', language) || 'Plans';

  return (
    <section id="pricing" className="scroll-mt-20 py-24 bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-16 border-l-8 border-[#DC2626] pl-6 uppercase italic">
          {sectionTitle}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Tab List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {pricingData.plans.map((plan, index) => {
              const name = getLocalizedValue(plan, 'name', language);
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`text-left px-6 py-5 font-black text-xl sm:text-2xl transition-all duration-300 uppercase skew-x-[-5deg] ${
                    isActive 
                      ? 'bg-[#DC2626] text-white shadow-[8px_8px_0_0_#F59E0B]' 
                      : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white'
                  }`}
                >
                  <span className="inline-block skew-x-[5deg]">{name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Plan Details */}
          <div className="w-full lg:w-2/3 bg-[#0a0a0a] p-8 lg:p-12 border-2 border-gray-800 relative min-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC2626] opacity-10 blur-[100px]"></div>
            
            {pricingData.plans.map((plan, index) => {
              if (activeTab !== index) return null;
              const name = getLocalizedValue(plan, 'name', language);
              const desc = getLocalizedValue(plan, 'description', language);
              const price = getLocalizedValue(plan, 'price', language);
              const features = plan.features || [];

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <h3 className="text-4xl sm:text-5xl font-black text-[#F59E0B] mb-4 uppercase">{name}</h3>
                  <div className="text-5xl sm:text-6xl font-black mb-8">
                    {price}
                  </div>
                  {desc && (
                    <p className="text-gray-300 text-lg sm:text-xl font-bold mb-10 leading-relaxed border-l-4 border-gray-700 pl-4">
                      {desc}
                    </p>
                  )}
                  {features.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {features.map((feat, i) => (
                        <li key={i} className="flex items-start text-lg font-bold">
                          <span className="text-[#DC2626] mr-3 font-black">X</span>
                          {getText(feat)}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
