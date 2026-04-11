import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, HelpCircle } from 'lucide-react';
import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

const iconMap: Record<string, any> = {
  mappin: MapPin,
  clock: Clock,
  phone: Phone,
  mail: Mail,
};

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { t } = useLocalize();

  if (!storeInfoData || !storeInfoData.items || storeInfoData.items.length === 0) return null;

  const sectionTitle = t(storeInfoData, 'sectionTitle');
  if (!sectionTitle) return null;

  return (
    <section id="storeInfo" className="bg-stone-50">
      {/* Full-width image with overlay caption — different from Theme 1 which shows image at bottom */}
      {storeInfoData.mainImage && (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={storeInfoData.mainImage}
            alt={t(storeInfoData, 'mainImageCaption')}
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 to-transparent" />
          <div className="absolute inset-0 flex items-center px-12 md:px-24">
            <div>
              <div className="w-8 h-px bg-amber-400 mb-6" />
              <h2 className="font-serif text-4xl md:text-5xl text-white font-light tracking-wider mb-3">
                {sectionTitle}
              </h2>
              <div className="w-8 h-px bg-amber-400" />
            </div>
          </div>
        </div>
      )}

      {/* Store info items — elegant horizontal list */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        {!storeInfoData.mainImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="w-8 h-px bg-amber-700 mx-auto mb-8" />
            <h2 className="font-serif text-5xl text-stone-800 font-light tracking-wider">
              {sectionTitle}
            </h2>
            <div className="w-8 h-px bg-amber-700 mx-auto mt-8" />
          </motion.div>
        )}

        <div className="divide-y divide-stone-200">
          {storeInfoData.items.map((item, index) => {
            const iconKey = (item.icon || '').toLowerCase();
            const IconComponent = iconMap[iconKey] || HelpCircle;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="flex items-start gap-8 py-10"
              >
                {/* Icon — minimal, no background */}
                <IconComponent className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-stone-800 font-medium tracking-wide mb-2">
                    {t(item, 'title')}
                  </h3>
                  <p className="font-serif text-stone-500 text-base leading-loose">
                    {t(item, 'content')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
