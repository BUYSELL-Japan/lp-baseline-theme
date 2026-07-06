import React from 'react';
import { motion } from 'framer-motion';
import { useCompanyData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Company() {
  const companyData = useCompanyData();
  const { getText, translate } = useLocalize();

  if (!companyData) return null;

  const sectionTitle = getText(companyData.sectionTitle);
  const hasPhilosophy = companyData.philosophy && getText(companyData.philosophy.title);
  const hasHistory = companyData.history?.timeline?.length > 0;
  const hasCompanyInfo = companyData.companyInfo?.items?.length > 0;

  if (!hasPhilosophy && !hasHistory && !hasCompanyInfo) return null;

  return (
    <section id="company" className="py-32 px-8 bg-amber-50/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {sectionTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-20"
          >
            <div className="w-8 h-px bg-amber-700 mb-8" />
            <h2 className="font-serif text-5xl text-stone-800 font-light tracking-wide">{sectionTitle}</h2>
            <p className="font-serif text-stone-500 mt-4 leading-loose">{getText(companyData.sectionSubtitle)}</p>
          </motion.div>
        )}

        <div className="space-y-24">
          {/* Philosophy — full-width quote style */}
          {hasPhilosophy && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <span className="font-serif text-xs tracking-[0.4em] uppercase text-amber-700 mb-6 block">
                {getText(companyData.philosophy.title)}
              </span>
              <blockquote className="relative pl-8 border-l border-amber-700">
                <p className="font-serif text-2xl md:text-3xl text-stone-700 font-light leading-loose italic">
                  {getText(companyData.philosophy.content)}
                </p>
              </blockquote>
            </motion.div>
          )}

          {/* History — vertical timeline without circle dots, clean lines */}
          {hasHistory && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <div className="flex items-baseline gap-6 mb-10">
                <span className="font-serif text-xs tracking-[0.4em] uppercase text-amber-700">{translate('sectionHistory')}</span>
                <h3 className="font-serif text-2xl text-stone-800 font-light tracking-wide">
                  {getText(companyData.history.title)}
                </h3>
              </div>
              <div className="pl-6 border-l border-stone-200 space-y-8">
                {companyData.history.timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="grid grid-cols-[80px_1fr] gap-6 items-baseline"
                  >
                    <span className="font-serif text-amber-700 font-medium text-sm tracking-widest">
                      {getText(item.year)}
                    </span>
                    <p className="font-serif text-stone-600 leading-relaxed">{getText(item.event)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Company Info — definition list style */}
          {hasCompanyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <div className="flex items-baseline gap-6 mb-10">
                <span className="font-serif text-xs tracking-[0.4em] uppercase text-amber-700">{translate('sectionCompany')}</span>
                <h3 className="font-serif text-2xl text-stone-800 font-light tracking-wide">
                  {getText(companyData.companyInfo.title)}
                </h3>
              </div>
              <div className="divide-y divide-stone-200">
                {companyData.companyInfo.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[160px_1fr] gap-8 py-6">
                    <span className="font-serif text-xs tracking-[0.2em] uppercase text-stone-400 pt-1">
                      {getText(item.label)}
                    </span>
                    <span className="font-serif text-stone-700 leading-relaxed">{getText(item.value)}</span>
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
