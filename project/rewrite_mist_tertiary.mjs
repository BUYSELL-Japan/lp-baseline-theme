import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src', 'components', 'themes', 'mist');

const staffContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Staff() {
  const staffData = useStaffData();
  const { language } = useLanguage();

  if (!staffData || !staffData.members || staffData.members.length === 0) return null;
  const sectionTitle = getLocalizedValue(staffData, 'sectionTitle', language);

  return (
    <section id="staff" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'スタッフ'}
          </h2>
        </motion.div>

        <div className="w-full flex flex-col space-y-24">
          {staffData.members.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center w-full"
            >
              <span className="font-sans font-light text-xs text-[#6B8F71] tracking-[0.2em] mb-4">
                {getLocalizedValue(member, 'role', language)}
              </span>
              <h4 className="font-sans font-medium text-[#444444] text-base mb-6 tracking-[0.1em]">
                {getLocalizedValue(member, 'name', language)}
              </h4>
              <p className="text-[#888888] font-light text-sm leading-loose tracking-widest max-w-lg whitespace-pre-line">
                {getLocalizedValue(member, 'description', language)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const newsContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function News() {
  const newsData = useNewsData();
  const { language } = useLanguage();

  if (!newsData || !newsData.items) return null;
  const sectionTitle = getLocalizedValue(newsData, 'sectionTitle', language);

  return (
    <section id="news" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'お知らせ'}
          </h2>
        </motion.div>

        <div className="w-full border-t border-[#EEEEEE]">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row py-8 border-b border-[#EEEEEE] gap-4"
            >
              <div className="w-full sm:w-1/4">
                <span className="text-[#888888] font-sans font-light text-xs tracking-widest block mb-2 sm:mb-0">
                  {item.date}
                </span>
                {item.category && (
                  <span className="inline-block text-[#6B8F71] text-[10px] tracking-widest border border-[#6B8F71] px-2 py-0.5 mt-2">
                    {getLocalizedValue(item, 'category', language)}
                  </span>
                )}
              </div>
              <div className="w-full sm:w-3/4">
                <h3 className="text-[#444444] font-sans font-medium text-sm leading-loose tracking-[0.1em] hover:text-[#6B8F71] transition-colors cursor-pointer">
                  {getLocalizedValue(item, 'title', language)}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const storeInfoContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useStoreInfoData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function StoreInfo() {
  const storeInfoData = useStoreInfoData();
  const { language } = useLanguage();

  if (!storeInfoData) return <SectionError sectionName="StoreInfo" error="No store info available" />;
  const sectionTitle = getLocalizedValue(storeInfoData, 'sectionTitle', language);

  return (
    <section id="storeInfo" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || '店舗情報'}
          </h2>
        </motion.div>

        <div className="w-full border-t border-[#EEEEEE]">
          {storeInfoData.items?.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row py-8 border-b border-[#EEEEEE] text-xs md:text-sm tracking-widest gap-2 sm:gap-6">
              <div className="w-full sm:w-1/3 text-[#444444] font-medium pt-1">
                {getLocalizedValue(item, 'title', language)}
              </div>
              <div className="w-full sm:w-2/3 text-[#888888] font-light leading-loose whitespace-pre-line">
                {getLocalizedValue(item, 'content', language)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const faqContent = `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFAQData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function FAQ() {
  const faqData = useFAQData();
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqData || !faqData.items || faqData.items.length === 0) return null;
  const sectionTitle = getLocalizedValue(faqData, 'sectionTitle', language);

  return (
    <section id="faq" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || 'よくある質問'}
          </h2>
        </motion.div>

        <div className="w-full border-t border-[#EEEEEE]">
          {faqData.items.map((item, index) => (
            <div key={index} className="border-b border-[#EEEEEE]">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex items-center justify-between text-left text-[#444444] font-sans font-medium text-sm tracking-widest hover:text-[#6B8F71] transition-colors"
              >
                <span className="pr-4 leading-loose">{getLocalizedValue(item, 'question', language)}</span>
                <span className="text-xs font-light tracking-[0] shrink-0 text-[#888888]">
                  {openIndex === index ? 'ー' : '＋'}
                </span>
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-8 text-[#888888] font-light text-xs md:text-sm leading-loose tracking-widest pl-4 border-l-2 border-[#6B8F71]/30 ml-2">
                  {getLocalizedValue(item, 'answer', language)}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const accessContent = `import React from 'react';
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
            {accessData.mapUrl ? (
              <iframe 
                src={accessData.mapUrl}
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
            <h3 className="font-sans font-medium text-[#444444] mb-4 text-sm tracking-widest">{translate('address', language)}</h3>
            <p className="text-[#888888] font-light text-sm leading-loose tracking-widest mb-12">
              {accessData.postalCode && <span>{accessData.postalCode}<br/></span>}
              {getLocalizedValue(accessData, 'address', language)}
            </p>
            
            <h3 className="font-sans font-medium text-[#444444] mb-4 text-sm tracking-widest">{translate('access', language)}</h3>
            <div className="text-[#888888] font-light text-sm leading-loose tracking-widest flex flex-col space-y-2">
              {accessData.transportation?.map((item, index) => (
                <div key={index}>・{getLocalizedValue(item, null, language)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync(path.join(dir, 'Staff.tsx'), staffContent);
fs.writeFileSync(path.join(dir, 'News.tsx'), newsContent);
fs.writeFileSync(path.join(dir, 'StoreInfo.tsx'), storeInfoContent);
fs.writeFileSync(path.join(dir, 'FAQ.tsx'), faqContent);
fs.writeFileSync(path.join(dir, 'Access.tsx'), accessContent);
fs.unlinkSync(path.join(dir, 'Reviews.tsx'));

console.log('Wrote remaining Mist components and removed Reviews.tsx');
