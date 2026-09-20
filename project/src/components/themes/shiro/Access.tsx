import React from 'react';
import { motion } from 'framer-motion';
import { useAccessData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue as getText, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Access() {
  const accessData = useAccessData();
  const { language } = useLanguage();

  if (!accessData) return <SectionError sectionName="Access" error="No access data available" data={accessData} />;

  return (
    <section id="access" className="bg-[#F8F8F8] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {getText(accessData.sectionTitle)}
          </h2>
          {accessData.sectionSubtitle && (
            <p className="text-base text-[#333333]">{getText(accessData.sectionSubtitle)}</p>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-white border border-[#E5E5E5] p-8"
          >
            <div className="space-y-6">
              {/* Address */}
              <div className="border-b border-[#E5E5E5] pb-6">
                <h3 className="font-sans font-bold text-[#333333] mb-2">{translate('address', language)}</h3>
                <p className="text-[#333333]">{getText(accessData.address)}</p>
              </div>

              {/* Transportation */}
              {accessData.transportation && (
                <div className="border-b border-[#E5E5E5] pb-6">
                  <h3 className="font-sans font-bold text-[#333333] mb-3">{getText(accessData.transportation.title)}</h3>
                  <div className="space-y-2">
                    {accessData.transportation.methods?.map((method, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <span className="font-bold text-[#2D6A4F] w-24 flex-shrink-0">{getText(method.type)}</span>
                        <span className="text-[#333333]">{getText(method.description)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parking */}
              {accessData.parking && (
                <div>
                  <h3 className="font-sans font-bold text-[#333333] mb-2">{getText(accessData.parking.title)}</h3>
                  <p className="text-[#333333] text-sm mb-1">{getText(accessData.parking.description)}</p>
                  {accessData.parking.capacity && (
                    <p className="text-[#2D6A4F] text-sm font-bold mb-1">
                      {translate('parkingCapacity', language).replace('{0}', accessData.parking.capacity.toString())}
                    </p>
                  )}
                  {accessData.parking.notes && (
                    <p className="text-[#333333] text-xs mt-2">{getText(accessData.parking.notes)}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-[50%] bg-[#E5E5E5] border border-[#E5E5E5] aspect-video lg:aspect-auto"
          >
            {accessData.mapUrl ? (
              <iframe
                src={accessData.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
                className="w-full h-full grayscale"
              ></iframe>
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-[#333333] text-sm">
                Map not available
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
