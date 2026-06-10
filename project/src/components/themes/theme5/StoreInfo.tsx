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
    <section id="storeInfo" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-0 items-stretch">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="aspect-square lg:aspect-auto lg:h-full overflow-hidden relative">
              <img
                src={storeInfoData.mainImage}
                alt={t(storeInfoData, 'mainImageCaption')}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              {/* Gold frame lines */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]" />
              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-950/80 px-6 py-4">
                <p className="text-white text-sm font-bold tracking-wider">
                  {t(storeInfoData, 'mainImageCaption')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 bg-gray-950 relative"
          >
            {/* Red noren accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0392B]" />

            <div className="p-10 lg:p-16 h-full flex flex-col">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-0.5 h-10 bg-[#C0392B]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Store Info</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tight">
                  {t(storeInfoData, 'sectionTitle')}
                </h2>
                <div className="mt-4 w-12 h-0.5 bg-[#D4AF37]" />
              </div>

              <div className="flex-1 divide-y divide-gray-800">
                {storeInfoData.items.map((item, index) => {
                  const iconKey = (item.icon || '').toLowerCase();
                  const IconComponent = iconMap[iconKey] || HelpCircle;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-6 py-6 group"
                    >
                      <div className="w-10 h-10 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                        <IconComponent className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                          {t(item, 'title')}
                        </h3>
                        <p className="text-base font-medium text-gray-300 leading-relaxed">
                          {t(item, 'content')}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
