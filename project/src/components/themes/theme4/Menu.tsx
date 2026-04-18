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
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(251,191,36,0.1)] border-4 border-white transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(239,68,68,0.2)] group-hover:border-yellow-400">
        <div className="relative overflow-hidden h-72 cursor-pointer" onClick={onImageClick}>
          <motion.img
            src={item.image}
            alt={t(item, 'name')}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          
          {/* Price Tag - Red & Yellow */}
          <div className="absolute top-6 right-6">
            <div className="bg-red-600 text-yellow-200 font-black px-6 py-2 rounded-full shadow-lg transform rotate-3 flex flex-col items-center leading-tight">
              <span className="text-xs uppercase opacity-80">{translate('price', 'en')}</span>
              <span className="text-xl">{t(item, 'price', item.price)}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-black text-rose-900 mb-3 group-hover:text-red-600 transition-colors">
            {t(item, 'name')}
          </h3>
          <p className="text-sm font-bold text-orange-950/60 leading-relaxed line-clamp-2">
            {t(item, 'description')}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <div className="w-8 h-1 bg-yellow-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Fresh Selection</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const menuData = useMenuData();
  const { t } = useLocalize();
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!menuData || !menuData.items) return null;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = menuData.items.map((item) => ({
    src: item.image,
    alt: t(item, 'name'),
  }));

  const sectionTitle = t(menuData, 'sectionTitle');

  return (
    <section id="menu" className="py-32 px-6 bg-white relative">
      {/* Tropical Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 transform -translate-y-[99%]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-white">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-red-600 rounded-full" />
            <span className="text-red-600 font-black uppercase tracking-[0.2em] text-xs">Exquisite Taste</span>
            <div className="w-12 h-1 bg-yellow-400 rounded-full" />
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60 max-w-2xl mx-auto">
            {t(menuData, 'sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
