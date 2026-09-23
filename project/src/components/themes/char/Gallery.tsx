import React, { useState } from 'react';
import { useGalleryData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';
import Lightbox from '../../Lightbox';

export default function Gallery() {
  const galleryData = useGalleryData();
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!galleryData) return <SectionError sectionName="Gallery" error="No gallery data available" />;
  if (!galleryData.images || galleryData.images.length === 0) return null;

  const sectionTitle = getLocalizedValue(galleryData, 'sectionTitle', language);
  const images = galleryData.images;
  const lightboxImages = images.map((img) => ({
    src: img.url,
    alt: getLocalizedValue(img, 'caption', language) || '',
  }));

  return (
    <section id="gallery" className="scroll-mt-20 py-24 md:py-32 px-6" style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'GALLERY'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        {/* 4列グリッド（モバイル2列） */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: '2px', backgroundColor: '#111111' }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden cursor-pointer"
              style={{ backgroundColor: '#111111' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <img
                src={img.url}
                alt={getLocalizedValue(img, 'caption', language) || ''}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)' }}
              />
              {/* ホバーオーバーレイ */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  backgroundColor: '#D4541A',
                  opacity: hoveredIndex === index ? 0.25 : 0,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => setLightboxIndex((p) => (p > 0 ? p - 1 : lightboxImages.length - 1))}
          onNext={() => setLightboxIndex((p) => (p < lightboxImages.length - 1 ? p + 1 : 0))}
        />
      )}
    </section>
  );
}
