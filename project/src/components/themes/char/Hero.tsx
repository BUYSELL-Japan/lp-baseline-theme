import React from 'react';
import { useHeroData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Hero() {
  const heroData = useHeroData();
  const { language } = useLanguage();

  if (!heroData) return null;

  const title = getLocalizedValue(heroData, 'sectionTitle', language);
  const subtitle = getLocalizedValue(heroData, 'subtitle', language);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      {/* 装飾ライン */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: '#D4541A' }}></div>
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ backgroundColor: '#D4541A' }}></div>

      <div className="relative z-10 w-full text-center px-4 pt-24 pb-16">
        {/* 超巨大アウトラインテキスト */}
        <h1
          className="font-sans font-black leading-none tracking-tight select-none"
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(3rem, 15vw, 18rem)',
            color: 'transparent',
            WebkitTextStroke: '2px #FFFFFF',
            lineHeight: 1,
          }}
        >
          {title}
        </h1>

        {/* キャッチコピー */}
        <p
          className="mt-8 font-sans font-normal tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            color: '#666666',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
          }}
        >
          {subtitle}
        </p>

        {/* ボタン */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#menu"
            className="inline-block font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 px-12 py-4 text-white"
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 700,
              backgroundColor: '#D4541A',
              border: '1px solid #D4541A',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#D4541A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#D4541A';
              (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
            }}
          >
            MENU
          </a>
          <a
            href="#contact"
            className="inline-block font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 px-12 py-4"
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 700,
              color: '#BBBBBB',
              border: '1px solid #444444',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#D4541A';
              (e.currentTarget as HTMLElement).style.color = '#D4541A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#444444';
              (e.currentTarget as HTMLElement).style.color = '#BBBBBB';
            }}
          >
            CONTACT
          </a>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-40">
        <span className="text-[#BBBBBB] text-xs tracking-[0.3em] font-sans">SCROLL</span>
        <div className="w-px h-12" style={{ backgroundColor: '#D4541A' }}></div>
      </div>
    </section>
  );
}
