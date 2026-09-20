import React from 'react';
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
