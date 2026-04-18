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
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-yellow-400 opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 items-center">
          
          {/* Map Side - Large & Floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/3 relative z-10"
          >
            <div className="aspect-video lg:aspect-[16/10] bg-white rounded-[4rem] p-4 shadow-2xl rotate-1">
              <div className="w-full h-full rounded-[3.5rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border-4 border-red-100">
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
            </div>
          </motion.div>

          {/* Info Side - Overlapping Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/5 lg:-ml-24 relative z-20"
          >
            <div className="bg-white rounded-[4rem] p-12 md:p-16 shadow-[0_40px_100px_rgba(220,38,38,0.15)] border-4 border-white rotate-[-1deg]">
              <div className="mb-12">
                <h2 className="text-5xl md:text-7xl font-black text-rose-950 mb-6 italic tracking-tighter leading-none">
                  {sectionTitle}
                </h2>
                <div className="w-24 h-4 bg-red-600 rounded-full" />
              </div>

              <div className="space-y-12">
                <div className="flex items-start gap-8">
                  <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shrink-0">
                    <MapPin className="w-8 h-8 text-yellow-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.3em] mb-3">
                      {translate('address', language)}
                    </h3>
                    <p className="text-2xl font-black text-rose-950 leading-tight italic">
                      {getText(accessData.address)}
                    </p>
                  </div>
                </div>

                {accessData.transportation && (
                  <div className="pt-10 border-t-2 border-orange-50">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                        <Train className="w-6 h-6 text-rose-950" />
                      </div>
                      <h4 className="text-2xl font-black text-rose-950 italic">
                        {getText(accessData.transportation.title)}
                      </h4>
                    </div>
                    <div className="space-y-6">
                      {accessData.transportation.methods?.map((method, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-1.5 h-12 bg-red-600/20 rounded-full shrink-0" />
                          <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">{getText(method.type)}</span>
                            <p className="text-lg font-bold text-orange-950/60 leading-tight">{getText(method.description)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
