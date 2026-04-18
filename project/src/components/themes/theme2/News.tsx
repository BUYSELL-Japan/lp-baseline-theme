import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function News() {
  const newsData = useNewsData();
  const { getText, getCategory } = useLocalize();

  if (!newsData) return <SectionError sectionName="News" error="No news data available" data={newsData} />;
  const sectionTitle = getText(newsData.sectionTitle);
  if (!sectionTitle) return <SectionError sectionName="News" error="Missing section title" data={newsData} />;
  if (!newsData.items || !Array.isArray(newsData.items) || newsData.items.length === 0) {
    return <SectionError sectionName="News" error="No news items found." data={newsData} />;
  }

  return (
    <section id="news" className="py-32 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-blue-500 mb-8" />
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            {sectionTitle}
          </h2>
          {newsData.sectionSubtitle && (
            <p className="text-xl text-slate-400">{getText(newsData.sectionSubtitle)}</p>
          )}
        </motion.div>

        <div className="space-y-4">
          {newsData.items.map((item: any, index: number) => {
            const title = getText(item.title);
            const content = getText(item.content);
            const category = getCategory(item.category);
            const date = typeof item.date === 'string' ? item.date : item.date?.ja || '';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 6 }}
                className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/40 p-6 md:p-8 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-600/30">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{date}</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg mt-1">
                        <Tag className="w-3 h-3" />
                        {category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
