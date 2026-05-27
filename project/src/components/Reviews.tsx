import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useReviewsData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/i18n';
import { useRef, useState, useEffect } from 'react';
import SectionError from './SectionError';

export default function Reviews() {
  const reviewsData = useReviewsData();
  const { getText } = useLocalize();
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  (()=>{})('[Reviews] reviewsData:', reviewsData);

  if (!reviewsData) {
    (()=>{})('[Reviews] No reviewsData');
    return <SectionError sectionName="Reviews" error="No reviews data available" data={reviewsData} />;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(index);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  const sectionTitle = getText(reviewsData.sectionTitle);
  const sectionSubtitle = getText(reviewsData.sectionSubtitle);

  (()=>{})('[Reviews] sectionTitle:', sectionTitle);
  (()=>{})('[Reviews] sectionSubtitle:', sectionSubtitle);
  (()=>{})('[Reviews] reviews:', reviewsData.reviews);

  if (!sectionTitle) {
    return <SectionError sectionName="Reviews" error="Missing section title" data={reviewsData} />;
  }

  if (!reviewsData.reviews || reviewsData.reviews.length === 0) {
    (()=>{})('[Reviews] Missing reviews array');
    return <SectionError sectionName="Reviews" error="No reviews found. Expected 'reviews' array in data." data={reviewsData} />;
  }

  return (
    <section id="reviews" className="py-24 px-4 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-theme-divider mx-auto mb-6" />
          <p className="text-xl text-gray-700">{sectionSubtitle}</p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.avatar}
                  alt={getText(review.name)}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{getText(review.name)}</h3>
                  <p className="text-sm text-gray-500">{getText(review.date)}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{getText(review.comment)}</p>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden -mx-4">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4"
          >
            {reviewsData.reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={getText(review.name)}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{getText(review.name)}</h3>
                      <p className="text-sm text-gray-500">{getText(review.date)}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed">{getText(review.comment)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {reviewsData.reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-theme-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${translate('review', language)} ${index + 1}${translate('showItem', language)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
