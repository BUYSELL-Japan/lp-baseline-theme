import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, HelpCircle } from 'lucide-react';
import { useStoreInfoData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import SectionError from './SectionError';

const iconMap: Record<string, any> = {
  mappin: MapPin,
  clock: Clock,
  phone: Phone,
  mail: Mail,
};

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { t } = useLocalize();

  console.log('[StoreInfo] storeInfoData:', storeInfoData);

  if (!storeInfoData) {
    console.log('[StoreInfo] No storeInfoData');
    return <SectionError sectionName="Store Info" error="No store information data available" data={storeInfoData} />;
  }

  const sectionTitle = t(storeInfoData, 'sectionTitle');

  console.log('[StoreInfo] sectionTitle:', sectionTitle);
  console.log('[StoreInfo] items:', storeInfoData.items);

  if (!sectionTitle) {
    return <SectionError sectionName="Store Info" error="Missing section title" data={storeInfoData} />;
  }

  if (!storeInfoData.items || !Array.isArray(storeInfoData.items) || storeInfoData.items.length === 0) {
    console.log('[StoreInfo] Missing items array');
    return <SectionError sectionName="Store Info" error="No store information items found. Expected 'items' array in data." data={storeInfoData} />;
  }

  return (
    <section id="storeInfo" className="py-24 px-4 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t(storeInfoData, 'sectionTitle')}</h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {storeInfoData.items.map((item, index) => {
            const iconKey = (item.icon || '').toLowerCase();
            const IconComponent = iconMap[iconKey] || HelpCircle;

            if (!iconMap[iconKey]) {
              console.warn(`[StoreInfo] Unknown icon: "${item.icon}", using default icon`);
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-teal-100 p-3 rounded-xl"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t(item, 'title')}</h3>
                    <p className="text-gray-700 leading-relaxed">{t(item, 'content')}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="aspect-video bg-gray-200 relative">
            <img
              src={storeInfoData.mainImage}
              alt={t(storeInfoData, 'mainImageCaption')}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-2xl font-bold">{t(storeInfoData, 'mainImageCaption')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
