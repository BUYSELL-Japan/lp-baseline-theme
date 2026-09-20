import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src', 'components', 'themes', 'mist');

const genericSection = (name, dataHook, bgColor) => `import React from 'react';
import { motion } from 'framer-motion';
import { ${dataHook} } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function ${name}() {
  const data = ${dataHook}();
  const { language } = useLanguage();

  if (!data) return <SectionError sectionName="${name}" error="No data available" />;

  const sectionTitle = getLocalizedValue(data, 'sectionTitle', language);

  return (
    <section id="${name.toLowerCase()}" className="bg-[${bgColor}] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-sans font-medium text-[#222222] tracking-[0.15em]">
            {sectionTitle || '${name}'}
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="w-full text-center text-[#888888] font-light text-sm leading-loose tracking-widest"
        >
          {/* Custom implementation inside */}
          <p>Content for ${name}</p>
        </motion.div>
      </div>
    </section>
  );
}
`;

const pricingContent = `import React from 'react';
import { motion } from 'framer-motion';
import { usePricingData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Pricing() {
  const pricingData = usePricingData();
  const { language } = useLanguage();

  if (!pricingData) return <SectionError sectionName="Pricing" error="No pricing data available" />;

  const sectionTitle = getLocalizedValue(pricingData, 'sectionTitle', language);
  const plans = pricingData.plans || [];

  return (
    <section id="pricing" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
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

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={\`flex flex-col text-center p-8 \${plan.isPopular ? 'border border-[#6B8F71] bg-[#F5F5F3]/50' : 'border border-[#EEEEEE] bg-[#FFFFFF]'}\`}
            >
              <h3 className="text-base font-sans font-medium text-[#444444] mb-4 tracking-[0.1em]">
                {getLocalizedValue(plan, 'name', language)}
              </h3>
              
              <div className="text-xl font-sans font-light text-[#6B8F71] mb-8 tracking-widest">
                {getLocalizedValue(plan, 'price', language)}
              </div>
              
              <ul className="flex flex-col space-y-4 text-[#888888] font-light text-xs tracking-widest flex-1">
                {plan.features?.map((feature, fIndex) => (
                  <li key={fIndex}>{getLocalizedValue(feature, null, language)}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const companyContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useCompanyData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Company() {
  const companyData = useCompanyData();
  const { language } = useLanguage();

  if (!companyData) return <SectionError sectionName="Company" error="No company data available" />;
  const sectionTitle = getLocalizedValue(companyData, 'sectionTitle', language);

  return (
    <section id="company" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
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

        {companyData.philosophy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-32 w-full"
          >
            <h3 className="text-sm font-sans font-medium text-[#444444] mb-8 tracking-[0.15em]">
              {getLocalizedValue(companyData.philosophy, 'title', language)}
            </h3>
            <p className="text-[#888888] font-light text-sm leading-loose tracking-widest whitespace-pre-line">
              {getLocalizedValue(companyData.philosophy, 'content', language)}
            </p>
          </motion.div>
        )}

        {companyData.companyInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-sm font-sans font-medium text-[#444444] mb-12 tracking-[0.15em] text-center">
              {getLocalizedValue(companyData.companyInfo, 'title', language)}
            </h3>
            <div className="border-t border-[#EEEEEE]">
              {companyData.companyInfo.items?.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row py-6 border-b border-[#EEEEEE] text-xs md:text-sm tracking-widest">
                  <div className="w-full sm:w-1/3 text-[#444444] mb-2 sm:mb-0 font-medium">
                    {getLocalizedValue(item, 'label', language)}
                  </div>
                  <div className="w-full sm:w-2/3 text-[#888888] font-light">
                    {getLocalizedValue(item, 'value', language)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
`;

const footerContent = `import React from 'react';
import { useFooterData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Footer() {
  const footerData = useFooterData();
  const { language } = useLanguage();

  if (!footerData) return <SectionError sectionName="Footer" error="No footer data available" />;

  const logoText = getLocalizedValue(footerData.logo, 'text', language);
  const description = getLocalizedValue(footerData, 'description', language);

  return (
    <footer className="bg-[#FFFFFF] py-24 px-6 border-t border-[#EEEEEE]">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="mb-12">
          {footerData.logo.image ? (
            <img 
              src={footerData.logo.image} 
              alt={logoText || 'Logo'} 
              className="h-8 object-contain grayscale opacity-80"
            />
          ) : (
            <span className="text-lg font-sans font-medium text-[#222222] tracking-[0.2em]">
              {logoText}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-[#888888] font-light text-xs tracking-widest mb-16 max-w-md leading-loose">
            {description}
          </p>
        )}

        <div className="w-full h-px bg-[#EEEEEE] mb-12" />

        <div className="text-[#888888] text-[10px] uppercase tracking-[0.3em]">
          {getLocalizedValue(footerData, 'copyright', language)}
        </div>
      </div>
    </footer>
  );
}
`;

const ctaContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useCTAData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function CTA() {
  const ctaData = useCTAData();
  const { language } = useLanguage();

  if (!ctaData) return <SectionError sectionName="CTA" error="No CTA data available" />;

  const title = getLocalizedValue(ctaData, 'sectionTitle', language);
  const description = getLocalizedValue(ctaData, 'description', language);

  return (
    <section id="cta" className="bg-[#FFFFFF] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-sans font-medium text-[#222222] mb-8 tracking-[0.15em]">
            {title}
          </h2>
          
          <p className="text-[#888888] font-light text-sm mb-16 tracking-widest leading-loose">
            {description}
          </p>
          
          {ctaData.buttons && ctaData.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {ctaData.buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href={getLocalizedValue(btn, 'link', language)}
                  className="inline-block border border-[#6B8F71] text-[#6B8F71] font-sans font-light px-12 py-3 hover:bg-[#6B8F71] hover:text-white transition-colors duration-500 text-xs md:text-sm tracking-[0.1em]"
                >
                  {getLocalizedValue(btn, 'text', language)}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
`;

const contactContent = `import React from 'react';
import { motion } from 'framer-motion';
import { useContactData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue, translate } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Contact() {
  const contactData = useContactData();
  const { language } = useLanguage();

  if (!contactData) return <SectionError sectionName="Contact" error="No contact data available" />;

  const sectionTitle = getLocalizedValue(contactData, 'sectionTitle', language);

  return (
    <section id="contact" className="bg-[#F5F5F3] py-32 md:py-48 px-6 border-b border-[#EEEEEE]">
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
          <div className="border-b border-[#E0E0E0]">
            <input
              type="text"
              placeholder={translate('namePlaceholder', language)}
              className="w-full bg-transparent px-0 py-4 font-sans font-light text-sm text-[#444444] placeholder-[#AAAAAA] focus:outline-none focus:border-[#6B8F71] transition-colors"
            />
          </div>
          <div className="border-b border-[#E0E0E0]">
            <input
              type="email"
              placeholder={translate('emailPlaceholder', language)}
              className="w-full bg-transparent px-0 py-4 font-sans font-light text-sm text-[#444444] placeholder-[#AAAAAA] focus:outline-none focus:border-[#6B8F71] transition-colors"
            />
          </div>
          <div className="border-b border-[#E0E0E0]">
            <textarea
              rows={4}
              placeholder={translate('messagePlaceholder', language)}
              className="w-full bg-transparent px-0 py-4 font-sans font-light text-sm text-[#444444] placeholder-[#AAAAAA] focus:outline-none focus:border-[#6B8F71] transition-colors resize-none"
            />
          </div>

          <div className="text-center pt-8">
            <button 
              type="button"
              className="inline-block border border-[#6B8F71] text-[#6B8F71] font-sans font-light px-16 py-4 hover:bg-[#6B8F71] hover:text-white transition-colors duration-500 text-xs tracking-[0.15em]"
            >
              {translate('submitButton', language)}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
`;

fs.writeFileSync(path.join(dir, 'Pricing.tsx'), pricingContent);
fs.writeFileSync(path.join(dir, 'Company.tsx'), companyContent);
fs.writeFileSync(path.join(dir, 'Footer.tsx'), footerContent);
fs.writeFileSync(path.join(dir, 'CTA.tsx'), ctaContent);
fs.writeFileSync(path.join(dir, 'Contact.tsx'), contactContent);

console.log('Wrote secondary Mist components');
