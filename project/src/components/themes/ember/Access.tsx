import { motion } from 'framer-motion';
import { MapPin, Car, Train } from 'lucide-react';
import { useAccessData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Access() {
  const accessData = useAccessData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  if (!accessData) return <SectionError sectionName="Access" error="No access data available" data={accessData} />;
  const sectionTitle = getText(accessData.sectionTitle);
  if (!sectionTitle) return <SectionError sectionName="Access" error="Missing section title" data={accessData} />;

  const hasParking = accessData.parking && typeof accessData.parking === 'object';
  const hasTransportation = accessData.transportation && typeof accessData.transportation === 'object';

  return (
    <section id="access" className="scroll-mt-20 py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-[#141414]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#8B0000] mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-wide text-gray-100 mb-4 border-b-2 border-[#D4AF37] pb-4 inline-block">
            {sectionTitle}
          </h2>
          {accessData.sectionSubtitle && (
            <p className="text-xl text-gray-200">{getText(accessData.sectionSubtitle)}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#141414] rounded-3xl border border-[#D4AF37]/30 p-8 space-y-6"
          >
            {accessData.address && (
              <div className="flex items-start gap-4">
                <div className="bg-[#1a1a1a] border border-[#D4AF37] p-3 rounded-xl flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold tracking-wide text-gray-100 mb-1">{translate('address', language)}</h3>
                  <p className="text-gray-200">{getText(accessData.address)}</p>
                </div>
              </div>
            )}

            {hasParking && (
              <div className="border-t border-[#D4AF37]/30 pt-6 flex items-start gap-4">
                <div className="bg-[#1a1a1a] border border-[#D4AF37] p-3 rounded-xl flex-shrink-0">
                  <Car className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold tracking-wide text-gray-100 mb-1">{getText(accessData.parking.title)}</h3>
                  {accessData.parking.description && (
                    <p className="text-gray-200 text-sm mb-1">{getText(accessData.parking.description)}</p>
                  )}
                  {accessData.parking.spaces && (
                    <p className="text-[#D4AF37] font-serif font-bold text-sm">
                      {translate('parkingSpaces', language)}: {getText(accessData.parking.spaces)}
                    </p>
                  )}
                  {accessData.parking.notes && (
                    <p className="text-gray-400 text-xs mt-1">{getText(accessData.parking.notes)}</p>
                  )}
                </div>
              </div>
            )}

            {hasTransportation && (
              <div className="border-t border-[#D4AF37]/30 pt-6 flex items-start gap-4">
                <div className="bg-[#1a1a1a] border border-[#D4AF37] p-3 rounded-xl flex-shrink-0">
                  <Train className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold tracking-wide text-gray-100 mb-3">{getText(accessData.transportation.title)}</h3>
                  <div className="space-y-2">
                    {accessData.transportation.methods && Array.isArray(accessData.transportation.methods) &&
                      accessData.transportation.methods.map((method, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-[#8B0000] rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <span className="font-serif font-bold tracking-wide text-gray-100 text-sm">{getText(method.type)}:</span>
                            <span className="text-gray-200 text-sm ml-2">{getText(method.description)}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border border-[#D4AF37]/30"
          >
            <div className="aspect-square bg-[#1a1a1a]">
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
