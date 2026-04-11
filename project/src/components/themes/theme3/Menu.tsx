import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import Lightbox from '../../Lightbox';

export default function Menu() {
  const menuData = useMenuData();
  const { t } = useLocalize();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!menuData || !menuData.items) return null;

  const lightboxImages = menuData.items.map((item) => ({
    src: item.image,
    alt: t(item, 'name'),
  }));

  // Group items by category if available, else show all as one group
  const grouped: { category: string; items: typeof menuData.items }[] = [];
  const categoryMap = new Map<string, typeof menuData.items>();
  menuData.items.forEach((item) => {
    const catRaw = item.category;
    const catKey = catRaw
      ? typeof catRaw === 'object'
        ? catRaw['ja'] || catRaw['en'] || Object.values(catRaw)[0] || 'メニュー'
        : String(catRaw)
      : 'メニュー';
    if (!categoryMap.has(catKey)) categoryMap.set(catKey, []);
    categoryMap.get(catKey)!.push(item);
  });
  if (categoryMap.size > 0) {
    categoryMap.forEach((items, category) => {
      grouped.push({ category, items });
    });
  } else {
    grouped.push({ category: 'メニュー', items: menuData.items });
  }

  return (
    <section id="menu" className="bg-stone-50">
      {/* Photo Feature Row — 3 wide images across top */}
      <div className="grid grid-cols-3 h-64 overflow-hidden">
        {menuData.items.slice(0, 3).map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
          >
            <img
              src={item.image}
              alt={t(item, 'name')}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/0 transition-colors duration-500" />
          </div>
        ))}
      </div>

      {/* Menu Section Header */}
      <div className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-300 pb-10"
        >
          <div>
            <span className="font-serif text-xs tracking-[0.4em] uppercase text-amber-700 mb-4 block">Our Menu</span>
            <h2 className="font-serif text-5xl md:text-6xl text-stone-800 font-light tracking-wide">
              {t(menuData, 'sectionTitle')}
            </h2>
          </div>
          <p className="font-serif text-stone-500 text-base leading-relaxed max-w-xs">
            {t(menuData, 'sectionSubtitle')}
          </p>
        </motion.div>
      </div>

      {/* Classic restaurant menu list */}
      <div className="max-w-5xl mx-auto px-8 pb-24 space-y-16">
        {grouped.map(({ category, items }, groupIndex) => (
          <div key={groupIndex}>
            {/* Category Header */}
            {grouped.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-px flex-1 bg-stone-300" />
                <span className="font-serif text-xs tracking-[0.4em] uppercase text-amber-800 px-4">{category}</span>
                <div className="h-px flex-1 bg-stone-300" />
              </motion.div>
            )}

            {/* Menu Items — classic list style */}
            <div className="space-y-0">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.07 }}
                  className="group border-b border-stone-200 last:border-none py-7 cursor-pointer"
                  onClick={() => { setLightboxIndex(menuData.items.indexOf(item)); setLightboxOpen(true); }}
                >
                  <div className="flex items-start gap-6">
                    {/* Thumbnail — small, square */}
                    <div className="w-20 h-20 shrink-0 overflow-hidden bg-stone-100">
                      <img
                        src={item.image}
                        alt={t(item, 'name')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-serif text-xl text-stone-800 font-light tracking-wide group-hover:text-amber-800 transition-colors duration-300">
                          {t(item, 'name')}
                        </h3>
                        {/* Price with dotted leader */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex-1 border-b border-dotted border-stone-300 min-w-8" />
                          <span className="font-serif text-amber-800 font-medium tracking-wide">
                            {t(item, 'price', item.price)}
                          </span>
                        </div>
                      </div>
                      <p className="font-serif text-stone-400 text-sm leading-relaxed mt-2">
                        {t(item, 'description')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => setLightboxIndex((p) => (p > 0 ? p - 1 : menuData.items.length - 1))}
          onNext={() => setLightboxIndex((p) => (p < menuData.items.length - 1 ? p + 1 : 0))}
        />
      )}
    </section>
  );
}
