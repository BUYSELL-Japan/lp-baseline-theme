import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { useNewsData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import SectionError from './SectionError';

export default function News() {
  const newsData = useNewsData();
  const { getText, getCategory } = useLocalize();

  if (!newsData) {
    return <SectionError sectionName="News" error="No news data available" data={newsData} />;
  }

  const sectionTitle = getText(newsData.sectionTitle);
  const sectionSubtitle = getText(newsData.sectionSubtitle);

  if (!sectionTitle) {
    return <SectionError sectionName="News" error="Missing section title" data={newsData} />;
  }

  if (!newsData.items || newsData.items.length === 0) {
    return <SectionError sectionName="News" error="No news items found. Expected 'items' array in data." data={newsData} />;
  }

  return (
    <section id="news" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-2 bg-theme-divider mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600">{sectionSubtitle}</p>
        </motion.div>

        <div className="space-y-6">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ x: 10, scale: 1.01 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="bg-theme-primary-light p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-theme-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{getText(item.date)}</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-theme-primary text-white text-xs rounded-full mt-1">
                      <Tag className="w-3 h-3" />
                      {getCategory(item.category)}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getText(item.title)}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{getText(item.content)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
