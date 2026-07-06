import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMenuData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import type { MenuItem as MenuItemType } from '../../../data/types';
import Lightbox from '../../Lightbox';

function MenuItem({ item, index, onImageClick }: { item: MenuItemType; index: number; onImageClick: () => void }) {
  const { t } = useLocalize();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group border-b border-gray-200 last:border-b-0"
    >
      <div className="flex flex-col sm:flex-row items-start gap-0 py-8 sm:py-0">
        {/* Image */}
        <div
          className="w-full sm:w-48 aspect-[4/3] overflow-hidden flex-shrink-0 cursor-pointer relative"
          onClick={onImageClick}
        >
          <img
            src={item.image}
            alt={t(item, 'name')}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gold frame on hover */}
          <div className="absolute inset-0 border border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="flex-1 sm:px-8 py-2 sm:py-6 flex flex-col justify-between min-h-[9rem]">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-[#C0392B] transition-colors">
                {t(item, 'name')}
              </h3>
              <div className="text-right flex-shrink-0">
                <span className="text-base font-black text-gray-900">
                  {t(item, 'price', item.price)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {t(item, 'description')}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-4 h-px bg-[#D4AF37]" />
            <div className="w-2 h-px bg-gray-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const menuData = useMenuData();
  const { t, translate } = useLocalize();
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
    <section id="menu" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Vertical decorative line */}
      <div className="absolute right-16 top-0 bottom-0 w-px bg-gray-100 hidden lg:block" />

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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{translate('menu')}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
            {t(menuData, 'sectionTitle')}
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-3 tracking-wider">
            {t(menuData, 'sectionSubtitle')}
          </p>
          <div className="mt-4 w-16 h-0.5 bg-[#D4AF37]" />
        </motion.div>

        {/* Menu Items List */}
        <div>
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
