import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, HelpCircle } from 'lucide-react';
import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

const iconMap: Record<string, any> = {
  mappin: MapPin,
  clock: Clock,
  phone: Phone,
  mail: Mail,
};

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { t } = useLocalize();

  if (!storeInfoData) return <SectionError sectionName="Store Info" error="No store information data available" data={storeInfoData} />;
  const sectionTitle = t(storeInfoData, 'sectionTitle');
  if (!sectionTitle) return <SectionError sectionName="Store Info" error="Missing section title" data={storeInfoData} />;
  if (!storeInfoData.items || !Array.isArray(storeInfoData.items) || storeInfoData.items.length === 0) {
    return <SectionError sectionName="Store Info" error="No store information items found." data={storeInfoData} />;
  }

  return (
    <section id="storeInfo" className="py-16 sm:py-12 md:py-28 lg:py-32 px-4 sm:px-6 bg-[#141414]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="w-16 h-1 bg-[#DC2626] mb-8" />
          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter font-bold tracking-wide text-gray-100 tracking-tighter border-b-2 border-[#F59E0B] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {storeInfoData.items.map((item, index) => {
            const iconKey = (item.icon || '').toLowerCase();
            const IconComponent = iconMap[iconKey] || HelpCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
                whileHover={{ y: -4 }}
                className="bg-[#141414] rounded-2xl border border-[#F59E0B]/30 hover:border-[#F59E0B] hover:shadow-md p-8 transition-colors"
              >
                <div className="flex items-start gap-5">
                  <div className="bg-[#1a1a1a] border border-[#F59E0B] p-3 rounded-xl flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-sans font-black tracking-tighter font-bold tracking-wide text-gray-100 mb-2">{t(item, 'title')}</h3>
                    <p className="text-gray-200 leading-relaxed">{t(item, 'content')}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {storeInfoData.mainImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border border-[#F59E0B]/30"
          >
            <div className="aspect-video bg-[#1a1a1a] relative">
              <img
                src={storeInfoData.mainImage}
                alt={t(storeInfoData, 'mainImageCaption')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent" />
              <div className="absolute bottom-6 left-8 text-white">
                <p className="text-2xl font-sans font-black tracking-tighter font-bold tracking-wide tracking-tighter">{t(storeInfoData, 'mainImageCaption')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
