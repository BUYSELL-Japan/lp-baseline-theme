import React from 'react';
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
  if (!sectionTitle) return null;

  const hasParking = accessData.parking && typeof accessData.parking === 'object';
  const hasTransportation = accessData.transportation && typeof accessData.transportation === 'object';

  return (
    <section id="access" className="bg-stone-900">
      {/* Map — full width, no border-radius */}
      {accessData.mapEmbedUrl && (
        <div className="w-full h-80 md:h-96 overflow-hidden opacity-80">
          <iframe
            src={accessData.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(80%) sepia(30%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={translate('storeMap', language)}
          />
        </div>
      )}

      {/* Info below map */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end gap-6 pb-12 mb-12 border-b border-stone-800"
        >
          <div>
            <div className="w-8 h-px bg-amber-500 mb-6" />
            <h2 className="font-serif text-5xl text-stone-100 font-light tracking-wide">{sectionTitle}</h2>
          </div>
          {accessData.sectionSubtitle && (
            <p className="font-serif text-stone-500 text-sm leading-relaxed md:ml-auto">
              {getText(accessData.sectionSubtitle)}
            </p>
          )}
        </motion.div>

        {/* Access Info — clean definition style */}
        <div className="grid md:grid-cols-3 gap-12">
          {accessData.address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <MapPin className="w-4 h-4 text-amber-500 mb-4" />
              <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-stone-500 mb-3">
                {translate('address', language)}
              </h3>
              <p className="font-serif text-stone-200 leading-loose">
                {getText(accessData.address)}
              </p>
            </motion.div>
          )}

          {hasParking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Car className="w-4 h-4 text-amber-500 mb-4" />
              <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-stone-500 mb-3">
                {getText(accessData.parking.title)}
              </h3>
              {accessData.parking.description && (
                <p className="font-serif text-stone-300 leading-loose text-sm mb-2">
                  {getText(accessData.parking.description)}
                </p>
              )}
              {accessData.parking.spaces && (
                <p className="font-serif text-amber-400 text-sm">
                  {translate('parkingSpaces', language)}: {getText(accessData.parking.spaces)}
                </p>
              )}
              {accessData.parking.notes && (
                <p className="font-serif text-stone-600 text-xs mt-2 leading-relaxed">
                  {getText(accessData.parking.notes)}
                </p>
              )}
            </motion.div>
          )}

          {hasTransportation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Train className="w-4 h-4 text-amber-500 mb-4" />
              <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-stone-500 mb-3">
                {getText(accessData.transportation.title)}
              </h3>
              <div className="space-y-3">
                {accessData.transportation.methods?.map((method, index) => (
                  <div key={index} className="font-serif text-sm">
                    <span className="text-stone-400 tracking-wide">{getText(method.type)}: </span>
                    <span className="text-stone-300">{getText(method.description)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
