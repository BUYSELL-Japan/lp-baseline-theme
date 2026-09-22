import React from 'react';
import { motion } from 'framer-motion';
import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue as t } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { language } = useLanguage();

  if (!storeInfoData) return <SectionError sectionName="StoreInfo" error="No store info data available" />;

  const sectionTitle = t(storeInfoData, 'sectionTitle', language);
  const sectionSubtitle = t(storeInfoData, 'sectionSubtitle', language);
  const items = storeInfoData.items || [];
  const image = storeInfoData.mainImage;
  const imageCaption = t(storeInfoData, 'mainImageCaption', language);

  return (
    <section id="storeInfo" className="scroll-mt-20 bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto">
        {(sectionTitle || sectionSubtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {sectionTitle && (
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && <p className="text-base text-[#333333]">{sectionSubtitle}</p>}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Info List */}
          <div className="flex-1">
            <div className="border-t border-[#E5E5E5]">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row py-4 border-b border-[#E5E5E5]"
                >
                  <div className="sm:w-1/3 font-sans font-bold text-[#333333] mb-2 sm:mb-0">
                    {t(item, 'title', language)}
                  </div>
                  <div className="sm:w-2/3 text-[#333333] whitespace-pre-line leading-relaxed">
                    {t(item, 'content', language)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          {image && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-[40%] flex flex-col"
            >
              <div className="aspect-[4/3] bg-[#F8F8F8] border border-[#E5E5E5] overflow-hidden mb-4">
                <img 
                  src={image} 
                  alt={imageCaption || sectionTitle || 'Store interior'} 
                  className="w-full h-full object-cover"
                />
              </div>
              {imageCaption && (
                <p className="text-sm text-[#333333] text-center">
                  {imageCaption}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
