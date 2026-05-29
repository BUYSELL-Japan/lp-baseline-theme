import { motion } from 'framer-motion';
import { MapPin, Car, Train } from 'lucide-react';
import { useAccessData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/i18n';
import SectionError from './SectionError';

export default function Access() {
  const accessData = useAccessData();
  const { getText } = useLocalize();
  const { language } = useLanguage();

  (()=>{})('[Access] accessData:', accessData);

  if (!accessData) {
    (()=>{})('[Access] No accessData');
    return <SectionError sectionName="Access" error="No access data available" data={accessData} />;
  }

  const sectionTitle = getText(accessData.sectionTitle);
  const sectionSubtitle = getText(accessData.sectionSubtitle);

  (()=>{})('[Access] sectionTitle:', sectionTitle);
  (()=>{})('[Access] address:', accessData.address);

  if (!sectionTitle) {
    (()=>{})('[Access] Missing sectionTitle');
    return <SectionError sectionName="Access" error="Missing section title" data={accessData} />;
  }

  const hasParking = accessData.parking && typeof accessData.parking === 'object';
  const hasTransportation = accessData.transportation && typeof accessData.transportation === 'object';

  return (
    <section id="access" className="py-24 px-4 bg-section-gradient">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-theme-divider mx-auto mb-6" />
          <p className="text-xl text-gray-700">{sectionSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {accessData.address && (
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-theme-primary-light p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-theme-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{translate('address', language)}</h3>
                  <p className="text-gray-700 text-lg">{getText(accessData.address)}</p>
                </div>
              </div>
            )}

            {hasParking && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-theme-primary-light p-3 rounded-xl">
                    <Car className="w-6 h-6 text-theme-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {getText(accessData.parking.title)}
                    </h3>
                    {accessData.parking.description && (
                      <p className="text-gray-700 mb-2">{getText(accessData.parking.description)}</p>
                    )}
                    {accessData.parking.spaces && (
                      <p className="text-theme-primary font-bold text-lg mb-2">
                        {translate('parkingSpaces', language)}: {getText(accessData.parking.spaces)}
                      </p>
                    )}
                    {accessData.parking.notes && (
                      <p className="text-sm text-gray-600">{getText(accessData.parking.notes)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {hasTransportation && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-theme-primary-light p-3 rounded-xl">
                    <Train className="w-6 h-6 text-theme-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {getText(accessData.transportation.title)}
                    </h3>
                    <div className="space-y-3">
                      {accessData.transportation.methods && Array.isArray(accessData.transportation.methods) && accessData.transportation.methods.map((method, index) => {
                        const typeText = getText(method.type);
                        const descText = getText(method.description);
                        if (!typeText && !descText) return null;

                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-theme-primary rounded-full mt-2 flex-shrink-0" />
                            <div>
                              {typeText && <span className="font-bold text-gray-900">{typeText}:</span>}
                              {descText && <span className="text-gray-700 ml-2">{descText}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="aspect-square bg-gray-200">
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
