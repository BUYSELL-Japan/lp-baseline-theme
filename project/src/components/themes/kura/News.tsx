import { motion } from 'framer-motion';

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
    <section id="news" className="scroll-mt-20 py-16 sm:py-32 md:py-48 md:py-28 lg:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#1a1a1a] mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif tracking-widest text-[#2D2D2D] tracking-tighter mb-4 border-b-2 border-[#C0392B] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
          {newsData.sectionSubtitle && (
            <p className="text-xl text-[#2D2D2D]">{getText(newsData.sectionSubtitle)}</p>
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
                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
                whileHover={{ x: 6 }}
                className="group bg-white rounded-2xl border border-[#C0392B]/30 hover:border-[#C0392B] hover:shadow-md p-6 md:p-8 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#C0392B]">
                      
                    </div>
                    <div>
                      <p className="text-sm text-[#2D2D2D] font-medium">{date}</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1a] text-white text-xs font-serif tracking-widest uppercase tracking-widest rounded-lg mt-1">
                        
                        {category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-serif tracking-widest text-[#2D2D2D] tracking-tight mb-2 group-hover:text-[#C0392B] transition-colors">
                      {title}
                    </h3>
                    <p className="text-[#2D2D2D] leading-relaxed text-sm">{content}</p>
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
