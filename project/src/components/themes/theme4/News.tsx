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
    <section id="news" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-red-50/10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-red-600/10 hidden lg:block" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-6 italic tracking-tighter leading-none">
            {sectionTitle}
          </h2>
          <div className="w-32 h-4 bg-red-600 mx-auto rounded-full shadow-lg" />
        </motion.div>

        <div className="relative space-y-24 lg:space-y-0">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              className={`relative flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 0 ? 'lg:flex-row-reverse' : ''
              } lg:mb-32`}
            >
              {/* Date Column */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className={`flex items-center gap-6 ${index % 2 === 0 ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                  <div className="w-32 h-32 bg-red-600 rounded-[2.5rem] flex flex-col items-center justify-center text-yellow-400 shadow-2xl rotate-3">
                    <span className="text-sm font-black uppercase opacity-60 leading-none mb-1">
                      {getText(item.date).split('-')[1] || 'OCT'}
                    </span>
                    <span className="text-5xl font-black italic tracking-tighter leading-none">
                      {getText(item.date).split('-')[2] || '24'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-red-600 uppercase tracking-[0.3em] mb-2">
                      {getCategory(item.category)}
                    </div>
                    <div className="text-lg font-bold text-red-950/40">
                      {getText(item.date).split('-')[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Dot (Desktop) */}
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white shadow-lg z-20 hidden lg:block" />

              {/* Content Column */}
              <div className="w-full lg:w-1/2">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-600/10 transition-colors" />
                  
                  <h3 className="text-2xl md:text-3xl font-black text-red-950 mb-6 italic tracking-tighter group-hover:text-red-600 transition-colors">
                    {getText(item.title)}
                  </h3>
                  <p className="text-lg font-bold text-red-950/60 leading-relaxed mb-8">
                    {getText(item.content)}
                  </p>
                  
                  <div className="flex items-center gap-4 text-red-600 font-black uppercase tracking-widest text-xs group-hover:gap-6 transition-all cursor-pointer">
                    <div className="w-12 h-px bg-red-600" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
