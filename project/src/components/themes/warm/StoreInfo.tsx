import { motion } from 'framer-motion';

import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';



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
    <section id="storeInfo" className="scroll-mt-20 py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#92400E] mb-8" />
          <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-normal text-[#1C1917] border-b-2 border-[#D97706] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {storeInfoData.items.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-[#D97706]/30 hover:border-[#D97706] hover:shadow-md p-8 transition-colors"
              >
                <div className="flex items-start gap-5">
                  
                  <div>
                    <h3 className="text-lg font-sans font-bold tracking-normal text-[#1C1917] mb-2">{t(item, 'title')}</h3>
                    <p className="text-[#1C1917] leading-relaxed">{t(item, 'content')}</p>
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
            className="rounded-3xl overflow-hidden border border-[#D97706]/30"
          >
            <div className="aspect-video bg-[#FFFBF0] relative">
              <img
                src={storeInfoData.mainImage}
                alt={t(storeInfoData, 'mainImageCaption')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 to-transparent" />
              <div className="absolute bottom-6 left-8 text-[#1C1917]">
                <p className="text-2xl font-sans font-bold tracking-normal">{t(storeInfoData, 'mainImageCaption')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
