import { motion } from 'framer-motion';
import { MapPin, Car, Train } from 'lucide-react';
import { useAccessData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';

export default function Access() {
  const accessData = useAccessData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  if (!accessData) return null;

  const sectionTitle = getText(accessData.sectionTitle);
  const sectionSubtitle = getText(accessData.sectionSubtitle);

  return (
    <section id="access" className="py-32 px-6 bg-amber-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Visit Us</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(239,68,68,0.05)] border-4 border-white">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-500/20">
                  <MapPin className="w-6 h-6 text-yellow-200" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-rose-900 mb-3 tracking-tight italic">
                    {translate('address', language)}
                  </h3>
                  <p className="text-xl font-bold text-orange-950/70 leading-relaxed italic">
                    {getText(accessData.address)}
                  </p>
                </div>
              </div>

              {accessData.parking && (
                <div className="mt-10 pt-10 border-t-2 border-orange-50 space-y-4">
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6 text-red-600" />
                    <h4 className="text-xl font-black text-rose-900">{getText(accessData.parking.title)}</h4>
                  </div>
                  <p className="text-sm font-bold text-orange-950/50 italic leading-relaxed">
                    {getText(accessData.parking.description)}
                  </p>
                  {accessData.parking.spaces && (
                    <div className="inline-block px-4 py-1 bg-yellow-400 rounded-full text-rose-900 text-xs font-black uppercase tracking-widest">
                      {translate('parkingSpaces', language)}: {getText(accessData.parking.spaces)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {accessData.transportation && (
              <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_20px_60px_rgba(251,191,36,0.05)] border-4 border-white">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-yellow-400 rounded-2xl shadow-lg">
                    <Train className="w-6 h-6 text-rose-900" />
                  </div>
                  <h3 className="text-2xl font-black text-rose-900 italic tracking-tight">
                    {getText(accessData.transportation.title)}
                  </h3>
                </div>
                <div className="space-y-6">
                  {accessData.transportation.methods?.map((method, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="w-2 h-10 bg-red-600/20 rounded-full group-hover:bg-red-600 transition-colors shrink-0" />
                      <div>
                        <span className="block text-xs font-black uppercase tracking-wider text-red-600 mb-1">{getText(method.type)}</span>
                        <p className="text-lg font-bold text-orange-950/70">{getText(method.description)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[4rem] shadow-[0_30px_80px_rgba(239,68,68,0.1)] overflow-hidden p-4 group"
          >
            <div className="aspect-square bg-amber-50 rounded-[3.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border-4 border-red-600/10 group-hover:border-red-600/30">
              <iframe
                src={accessData.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={translate('storeMap', language)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
