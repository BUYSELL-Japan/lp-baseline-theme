import React from 'react';
import { motion } from 'framer-motion';
import { useContactData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Contact() {
  const contactData = useContactData();
  const { language } = useLanguage();

  if (!contactData) return <SectionError sectionName="Contact" error="No contact data available" />;

  const sectionTitle = getLocalizedValue(contactData, 'sectionTitle', language);
  const nameLabel = getLocalizedValue(contactData.fields, 'name', language) || 'Name';
  const emailLabel = getLocalizedValue(contactData.fields, 'email', language) || 'Email';
  const messageLabel = getLocalizedValue(contactData.fields, 'message', language) || 'Message';
  const submitText = getLocalizedValue(contactData, 'submitButton', language) || 'Submit';

  return (
    <section id="contact" className="scroll-mt-20 bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle}
          </h2>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col space-y-12"
        >
          <div className="border-b border-[#CCCCCC]">
            <label className="block text-xs font-sans font-medium text-[#444444] mb-2 tracking-widest">{nameLabel}</label>
            <input
              type="text"
              placeholder=""
              className="w-full bg-transparent px-0 py-2 font-sans font-light text-sm text-[#444444] focus:outline-none focus:border-[#6B8F71] transition-colors"
            />
          </div>
          <div className="border-b border-[#CCCCCC]">
            <label className="block text-xs font-sans font-medium text-[#444444] mb-2 tracking-widest">{emailLabel}</label>
            <input
              type="email"
              placeholder=""
              className="w-full bg-transparent px-0 py-2 font-sans font-light text-sm text-[#444444] focus:outline-none focus:border-[#6B8F71] transition-colors"
            />
          </div>
          <div className="border-b border-[#CCCCCC]">
            <label className="block text-xs font-sans font-medium text-[#444444] mb-2 tracking-widest">{messageLabel}</label>
            <textarea
              rows={4}
              placeholder=""
              className="w-full bg-transparent px-0 py-2 font-sans font-light text-sm text-[#444444] focus:outline-none focus:border-[#6B8F71] transition-colors resize-none"
            />
          </div>

          <div className="text-center pt-8">
            <button 
              type="button"
              className="inline-block border border-[#CCCCCC] bg-[#FFFFFF] text-[#444444] font-sans font-light px-16 py-4 hover:border-[#6B8F71] hover:text-[#6B8F71] transition-colors duration-500 text-xs tracking-[0.15em]"
            >
              {submitText}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
