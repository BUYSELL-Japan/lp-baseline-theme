import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translate } from '../../../utils/i18n';
import type { MenuItem as MenuItemType } from '../../../data/types';
import Lightbox from '../../Lightbox';

function MenuItem({ item, index, onImageClick }: { item: MenuItemType; index: number; onImageClick: () => void }) {
  const { t } = useLocalize();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative mb-24 lg:mb-32 ${index % 2 === 0 ? 'lg:pr-24' : 'lg:pl-24 lg:mt-32'}`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-[3rem] p-6 shadow-2xl hover:shadow-red-500/10 transition-shadow duration-500 group">
        <div className="w-full md:w-2/5 aspect-square overflow-hidden rounded-[2.5rem] cursor-pointer" onClick={onImageClick}>
          <motion.img
            src={item.image}
            alt={t(item, 'name')}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div className="w-full md:w-3/5 space-y-4 py-4 pr-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-3xl font-black text-rose-950 group-hover:text-red-600 transition-colors italic tracking-tighter">
              {t(item, 'name')}
            </h3>
            <div className="text-2xl font-black text-red-600 italic">
              {t(item, 'price', item.price)}
            </div>
          </div>
          <p className="text-lg font-bold text-orange-950/60 leading-relaxed">
            {t(item, 'description')}
          </p>
          <div className="w-12 h-2 bg-yellow-400 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

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
    <section id="menu" className="py-32 px-6 bg-white relative">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-6xl md:text-9xl font-black text-rose-950 mb-6 italic tracking-tighter leading-none">
            {t(menuData, 'sectionTitle')}
          </h2>
          <p className="text-2xl md:text-4xl font-black text-orange-900/40 italic">
            {t(menuData, 'sectionSubtitle')}
          </p>
        </motion.div>

        <div className="space-y-12">
          {menuData.items.map((item, index) => (
            <MenuItem key={index} item={item} index={index} onImageClick={() => openLightbox(index)} />
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
