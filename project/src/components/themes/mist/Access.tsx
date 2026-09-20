import React from 'react';
import { motion } from 'framer-motion';
import { useAccessData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Access() {
  const accessData = useAccessData();
  const { language } = useLanguage();

  if (!accessData) return <SectionError sectionName="Access" error="No access data available" />;
  const sectionTitle = getLocalizedValue(accessData, 'sectionTitle', language);

  return (
    <section id="access" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'アクセス'}
          </h2>
        </motion.div>

        <div className="w-full flex flex-col space-y-16">
          <div className="w-full aspect-[21/9] bg-[#E0E0E0] grayscale border border-[#EEEEEE]">
            {accessData.mapEmbedUrl ? (
              <iframe 
                src={accessData.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Google Map"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#888888] font-light text-sm tracking-widest">MAP</div>
            )}
          </div>
          
          <div className="w-full border-t border-[#EEEEEE] pt-12">
            <h3 className="font-sans font-medium text-[#444444] mb-4 text-sm tracking-widest">{translate('address', language) || '所在地'}</h3>
            <p className="text-[#888888] font-light text-sm leading-loose tracking-widest mb-12">
              {getLocalizedValue(accessData, 'address', language)}
            </p>
            
            {accessData.transportation && accessData.transportation.methods && (
              <>
                <h3 className="font-sans font-medium text-[#444444] mb-4 text-sm tracking-widest">
                  {getLocalizedValue(accessData.transportation, 'title', language) || translate('access', language) || 'アクセス'}
                </h3>
                <div className="text-[#888888] font-light text-sm leading-loose tracking-widest flex flex-col space-y-2">
                  {accessData.transportation.methods.map((method, index) => (
                    <div key={index}>
                      ・{getLocalizedValue(method, 'type', language)}: {getLocalizedValue(method, 'description', language)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
