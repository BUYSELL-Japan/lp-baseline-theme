import React from 'react';
import { motion } from 'framer-motion';
import { useNewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function News() {
  const newsData = useNewsData();
  const { getText } = useLocalize();

  if (!newsData || !newsData.items || newsData.items.length === 0) return null;

  const sectionTitle = getText(newsData.sectionTitle);
  if (!sectionTitle) return null;

  return (
    <section id="news" className="py-32 px-8 bg-stone-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-10 border-b border-stone-300"
        >
          <div>
            <div className="w-8 h-px bg-amber-700 mb-6" />
            <h2 className="font-serif text-5xl text-stone-800 font-light tracking-wide">{sectionTitle}</h2>
          </div>
          <p className="font-serif text-stone-500 text-sm tracking-wide mt-4 md:mt-0">
            {getText(newsData.sectionSubtitle)}
          </p>
        </motion.div>

        {/* News items — newspaper column style */}
        <div className="divide-y divide-stone-200">
          {newsData.items.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group py-10 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-start cursor-pointer"
            >
              {/* Left: Date + Category */}
              <div className="shrink-0">
                <p className="font-serif text-stone-400 text-xs tracking-[0.2em] uppercase mb-2">
                  {getText(item.date)}
                </p>
                <span className="font-serif text-xs tracking-[0.2em] uppercase text-amber-700 border-b border-amber-700/40 pb-0.5">
                  {getText(item.category)}
                </span>
              </div>

              {/* Right: Content */}
              <div>
                <h3 className="font-serif text-2xl text-stone-800 font-light tracking-wide leading-snug mb-4 group-hover:text-amber-800 transition-colors duration-300">
                  {getText(item.title)}
                </h3>
                <p className="font-serif text-stone-500 text-sm leading-loose">
                  {getText(item.content)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
