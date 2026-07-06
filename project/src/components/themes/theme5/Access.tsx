import { motion } from 'framer-motion';
import { MapPin, Train } from 'lucide-react';
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

  return (
    <section id="access" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-stretch gap-0">

          {/* Info Panel — Left, Dark */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/5 bg-gray-950 relative"
          >
            {/* Red noren top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0392B]" />

            <div className="p-10 lg:p-14 h-full">
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-0.5 h-10 bg-[#C0392B]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{translate('sectionAccess', language)}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tight">
                  {sectionTitle}
                </h2>
                <div className="mt-4 w-12 h-0.5 bg-[#D4AF37]" />
              </div>

              {/* Address */}
              <div className="mb-8 flex items-start gap-5 group">
                <div className="w-9 h-9 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#D4AF37] transition-colors">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">
                    {translate('address', language)}
                  </p>
                  <p className="text-base font-medium text-gray-300 leading-relaxed">
                    {getText(accessData.address)}
                  </p>
                </div>
              </div>

              {/* Transportation */}
              {accessData.transportation && (
                <div className="border-t border-gray-800 pt-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-9 h-9 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                      <Train className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      {getText(accessData.transportation.title)}
                    </h4>
                  </div>
                  <div className="space-y-5">
                    {accessData.transportation.methods?.map((method, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-px bg-gray-800 shrink-0 ml-4" />
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">
                            {getText(method.type)}
                          </span>
                          <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            {getText(method.description)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parking info */}
              {accessData.parking && (
                <div className="border-t border-gray-800 pt-8 mt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">
                    {getText(accessData.parking.title)}
                  </h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    {getText(accessData.parking.description)}
                  </p>
                  {accessData.parking.spaces && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-[#D4AF37] font-black text-lg">
                        {getText(accessData.parking.spaces)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Map — Right, Full height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-3/5 min-h-[350px] lg:min-h-[500px] relative"
          >
            <div className="w-full h-full min-h-[350px] lg:min-h-[500px] overflow-hidden relative">
              <iframe
                src={accessData.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={translate('storeMap', language)}
                className="grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            {/* Gold frame corners */}
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#D4AF37] z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#D4AF37] z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
