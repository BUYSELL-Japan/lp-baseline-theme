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
    <section id="storeInfo" className="py-32 px-6 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Location & Details</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {t(storeInfoData, 'sectionTitle')}
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-yellow-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {storeInfoData.items.map((item, index) => {
            const iconKey = (item.icon || '').toLowerCase();
            const IconComponent = iconMap[iconKey] || HelpCircle;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-amber-50 p-10 rounded-[3rem] flex items-start gap-6 border-2 border-transparent hover:border-yellow-400 transition-all duration-300 shadow-[0_10px_30px_rgba(251,191,36,0.05)]"
              >
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-500/20">
                  <IconComponent className="w-6 h-6 text-yellow-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-rose-900 mb-2 tracking-tight">
                    {t(item, 'title')}
                  </h3>
                  <p className="text-lg font-bold text-orange-950/60 leading-relaxed italic">
                    {t(item, 'content')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[3.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.1)] p-4 bg-white"
        >
          <div className="aspect-video rounded-[3rem] overflow-hidden relative">
            <img
              src={storeInfoData.mainImage}
              alt={t(storeInfoData, 'mainImageCaption')}
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10">
              <span className="px-4 py-1.5 bg-yellow-400 text-rose-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg block mb-3 w-fit">
                Featured View
              </span>
              <p className="text-4xl font-black text-white italic tracking-tight drop-shadow-lg">
                {t(storeInfoData, 'mainImageCaption')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
