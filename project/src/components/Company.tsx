import { motion } from 'framer-motion';
import { Building2, History, Heart } from 'lucide-react';
import { useCompanyData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import SectionError from './SectionError';

export default function Company() {
  const companyData = useCompanyData();
  const { getText } = useLocalize();

  if (!companyData) {
    return <SectionError sectionName="Company" error="No company data available" data={companyData} />;
  }

  const sectionTitle = getText(companyData.sectionTitle);
  const sectionSubtitle = getText(companyData.sectionSubtitle);

  const hasPhilosophy = !!(companyData.philosophy && (getText(companyData.philosophy.title) || getText(companyData.philosophy.content)));
  const hasHistory = !!(companyData.history && companyData.history.timeline && Array.isArray(companyData.history.timeline) && companyData.history.timeline.some(item => getText(item.year) || getText(item.event)));
  const hasCompanyInfo = !!(companyData.companyInfo && companyData.companyInfo.items && Array.isArray(companyData.companyInfo.items) && companyData.companyInfo.items.some(item => getText(item.label) || getText(item.value)));

  if (!hasPhilosophy && !hasHistory && !hasCompanyInfo) {
    return <SectionError sectionName="Company" error="No company content found. Expected at least one of: philosophy, history, or companyInfo." data={companyData} />;
  }

  return (
    <section id="company" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {(sectionTitle || sectionSubtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            {sectionTitle && (
              <>
                <div className="w-16 h-2 bg-theme-divider mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {sectionTitle}
                </h2>
              </>
            )}
            {sectionSubtitle && (
              <p className="text-xl text-gray-600">{sectionSubtitle}</p>
            )}
          </motion.div>
        )}

        <div className="space-y-12">
          {hasPhilosophy && (
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-theme-primary-light p-4 rounded-2xl">
                <Heart className="w-8 h-8 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {getText(companyData.philosophy.title)}
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {getText(companyData.philosophy.content)}
            </p>
          </motion.div>
          )}

          {hasHistory && (
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-theme-primary-light p-4 rounded-2xl">
                <History className="w-8 h-8 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {getText(companyData.history.title)}
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-theme-primary-light" />
              <div className="space-y-6">
                {companyData.history.timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-1 w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="font-bold text-theme-primary text-lg mb-1">
                        {getText(item.year)}
                      </div>
                      <div className="text-gray-700">{getText(item.event)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          )}

          {hasCompanyInfo && (
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-theme-primary-light p-4 rounded-2xl">
                <Building2 className="w-8 h-8 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {getText(companyData.companyInfo.title)}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyData.companyInfo.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex flex-col md:flex-row md:items-start gap-2"
                >
                  <div className="font-bold text-theme-primary min-w-[120px]">
                    {getText(item.label)}
                  </div>
                  <div className="text-gray-700 flex-1">{getText(item.value)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
