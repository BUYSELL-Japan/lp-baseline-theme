import React from 'react';
import { motion } from 'framer-motion';
import { useContactData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Contact() {
  const contactData = useContactData();
  const { language } = useLanguage();

  if (!contactData) return <SectionError sectionName="Contact" error="No contact data available" data={contactData} />;

  return (
    <section id="contact" className="scroll-mt-20 bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {getLocalizedValue(contactData, 'sectionTitle', language)}
          </h2>
          {contactData.sectionSubtitle && (
            <p className="text-base text-[#333333]">{getLocalizedValue(contactData, 'sectionSubtitle', language)}</p>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#F8F8F8] border border-[#E5E5E5] p-8 md:p-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-sans font-bold text-sm text-[#333333]">
                {translate('formName', language)}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#333333] focus:outline-none focus:border-[#2D6A4F] transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block font-sans font-bold text-sm text-[#333333]">
                {translate('formEmail', language)}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#333333] focus:outline-none focus:border-[#2D6A4F] transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block font-sans font-bold text-sm text-[#333333]">
              {translate('formPhone', language)} <span className="text-sm font-normal text-[#333333]/60">({translate('optional', language)})</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#333333] focus:outline-none focus:border-[#2D6A4F] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block font-sans font-bold text-sm text-[#333333]">
              {translate('formMessage', language)}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#333333] focus:outline-none focus:border-[#2D6A4F] transition-colors resize-none"
              required
            ></textarea>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#2D6A4F] text-white hover:bg-[#1b4332] py-4 font-sans font-bold text-base transition-colors"
            >
              {translate('formSubmit', language)}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
