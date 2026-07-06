import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function News() {
  const newsData = useNewsData();
  const { getText, getCategory, translate } = useLocalize();

  if (!newsData || !newsData.items) return null;

  const sectionTitle = getText(newsData.sectionTitle);

  return (
    <section id="news" className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      {/* Horizontal rules decoration */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37]/30" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-0.5 h-10 bg-[#C0392B]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{translate('sectionNews')}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
            {sectionTitle}
          </h2>
          <div className="mt-3 w-16 h-0.5 bg-[#D4AF37]" />
        </motion.div>

        {/* News Items — magazine list layout */}
        <div className="divide-y divide-gray-200">
          {newsData.items.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group py-8 flex flex-col sm:flex-row gap-6 items-start hover:bg-white transition-colors"
            >
              {/* Date block */}
              <div className="flex-shrink-0 w-20 text-center">
                <div className="bg-gray-900 text-white py-2 px-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {getText(item.date).split('-')[1] || '--'}
                  </span>
                  <span className="block text-3xl font-black leading-none">
                    {getText(item.date).split('-')[2] || '--'}
                  </span>
                  <span className="block text-[9px] font-bold text-gray-400 mt-1">
                    {getText(item.date).split('-')[0]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 relative pl-0 sm:pl-4 border-l-0 sm:border-l border-gray-200 group-hover:border-[#D4AF37] transition-colors">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C0392B] mb-2">
                  {getCategory(item.category)}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight tracking-tight group-hover:text-gray-700 transition-colors">
                  {getText(item.title)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {getText(item.content)}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-6 h-px bg-[#D4AF37]" />
                  <div className="w-3 h-px bg-gray-300" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
