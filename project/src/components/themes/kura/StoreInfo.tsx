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
    <section id="storeInfo" className="py-16 sm:py-32 md:py-48 md:py-28 lg:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#1a1a1a] mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif tracking-widest text-[#2D2D2D] tracking-tighter border-b-2 border-[#C0392B] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {storeInfoData.items.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-[#C0392B]/30 hover:border-[#C0392B] hover:shadow-md p-8 transition-colors"
              >
                <div className="flex items-start gap-5">
                  
                  <div>
                    <h3 className="text-lg font-serif tracking-widest text-[#2D2D2D] mb-2">{t(item, 'title')}</h3>
                    <p className="text-[#2D2D2D] leading-relaxed">{t(item, 'content')}</p>
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
            className="mt-16"
          >
            <div className="aspect-video bg-[#F5F0E8] overflow-hidden mb-8 border border-[#E5E5E5]">
              <img
                src={storeInfoData.mainImage}
                alt={t(storeInfoData, 'mainImageCaption')}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-serif tracking-widest text-[#1a1a1a]">
                {t(storeInfoData, 'mainImageCaption')}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
