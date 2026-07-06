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

  if (!storeInfoData || !storeInfoData.items) return null;

  return (
    <section id="storeInfo" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-px bg-red-600/10 rotate-45 translate-x-1/2" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Info Cards Side */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-8 italic tracking-tighter leading-none">
                {t(storeInfoData, 'sectionTitle')}
              </h2>
              <div className="w-24 h-4 bg-yellow-400 rounded-full shadow-lg" />
            </motion.div>

            <div className="space-y-6">
              {storeInfoData.items.map((item, index) => {
                const iconKey = (item.icon || '').toLowerCase();
                const IconComponent = iconMap[iconKey] || HelpCircle;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.08, 0.4) }}
                    className="flex items-center gap-8 p-8 bg-red-50/50 rounded-[3rem] border-2 border-transparent hover:border-red-600 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-xl rotate-3">
                      <IconComponent className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-red-950 uppercase tracking-tighter italic">
                        {t(item, 'title')}
                      </h3>
                      <p className="text-lg font-bold text-red-950/60 leading-tight">
                        {t(item, 'content')}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Image Side - Offset & Floating */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 p-4 bg-white rounded-[4rem] shadow-2xl -rotate-2"
            >
              <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden relative">
                <img
                  src={storeInfoData.mainImage}
                  alt={t(storeInfoData, 'mainImageCaption')}
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-12 left-12 right-12">
                  <p className="text-3xl font-black text-white italic tracking-tighter leading-tight drop-shadow-2xl">
                    {t(storeInfoData, 'mainImageCaption')}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Background Blob behind image */}
            <div className="absolute -top-12 -right-12 w-full h-full bg-yellow-400 opacity-20 rounded-[4rem] -z-10 rotate-3" />
          </div>

        </div>
      </div>
    </section>
  );
}
