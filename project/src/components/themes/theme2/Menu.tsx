import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import Lightbox from '../../Lightbox';

export default function Menu() {
  const menuData = useMenuData();
  const { t } = useLocalize();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!menuData || !menuData.items) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = menuData.items.map((item) => ({
    src: item.image,
    alt: t(item, 'name'),
  }));

  return (
    <section id="menu" className="py-32 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-4 block">
            Our Menu
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 underline decoration-blue-600 underline-offset-8">
            {t(menuData, 'sectionTitle')}
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
            {t(menuData, 'sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {menuData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 transition-all duration-500 group-hover:border-blue-500/50 group-hover:shadow-[0_0_50px_rgba(37,99,235,0.15)]">
                <img 
                  src={item.image} 
                  alt={t(item, 'name')} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Modern Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pt-32">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter mb-1">
                        {t(item, 'name')}
                      </h3>
                      <p className="text-blue-400 font-black text-sm uppercase tracking-widest">
                        Available Now
                      </p>
                    </div>
                    <div className="text-2xl font-black text-white bg-blue-600 px-4 py-1 rounded-xl shadow-lg shadow-blue-600/30">
                      {t(item, 'price', item.price)}
                    </div>
                  </div>
                </div>
                
                {/* Detail View Indicator */}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mx-0.5" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full mx-0.5" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full mx-0.5" />
                   </div>
                </div>
              </div>
              
              <div className="mt-6 px-4">
                <p className="text-slate-500 text-lg leading-relaxed font-medium line-clamp-2">
                  {t(item, 'description')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {lightboxOpen && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrevious={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : menuData.items.length - 1))}
            onNext={() => setLightboxIndex((prev) => (prev < menuData.items.length - 1 ? prev + 1 : 0))}
          />
        )}
      </div>
    </section>
  );
}
