import { motion } from 'framer-motion';
import { Calendar, Tag, ChevronRight } from 'lucide-react';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function News() {
  const newsData = useNewsData();
  const { getText, getCategory } = useLocalize();

  if (!newsData || !newsData.items) return null;

  const sectionTitle = getText(newsData.sectionTitle);
  const sectionSubtitle = getText(newsData.sectionSubtitle);

  return (
    <section id="news" className="py-32 px-6 bg-amber-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">What's New</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="space-y-4">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-8"
            >
              <div className="flex-shrink-0 flex items-center gap-6">
                <div className="w-20 h-20 bg-red-600 rounded-2xl flex flex-col items-center justify-center text-yellow-200 shadow-lg shadow-red-500/20">
                  <Calendar className="w-5 h-5 mb-1 opacity-60" />
                  <span className="text-xs font-black uppercase tracking-tighter leading-none">
                    {getText(item.date).split('-')[1] || 'OCT'}
                  </span>
                  <span className="text-2xl font-black italic leading-none">
                    {getText(item.date).split('-')[2] || '24'}
                  </span>
                </div>
                <div className="h-12 w-[2px] bg-red-100 hidden md:block" />
              </div>

              <div className="flex-grow">
                <div className="inline-block px-3 py-1 bg-yellow-400 text-rose-900 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                  {getCategory(item.category)}
                </div>
                <h3 className="text-2xl font-black text-rose-900 mb-2 group-hover:text-red-600 transition-colors tracking-tight">
                  {getText(item.title)}
                </h3>
                <p className="text-sm font-bold text-orange-950/50 leading-relaxed italic">
                  {getText(item.content)}
                </p>
              </div>

              <div className="flex-shrink-0 text-red-500 group-hover:translate-x-2 transition-transform">
                <ChevronRight className="w-8 h-8" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
