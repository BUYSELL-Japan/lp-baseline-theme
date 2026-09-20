import { motion } from 'framer-motion';

import { useReviewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function Reviews() {
  const reviewsData = useReviewsData();
  const { t } = useLocalize();

  if (!reviewsData) return <SectionError sectionName="Reviews" error="No reviews data available" data={reviewsData} />;
  const sectionTitle = t(reviewsData, 'sectionTitle');
  if (!sectionTitle) return <SectionError sectionName="Reviews" error="Missing section title" data={reviewsData} />;
  if (!reviewsData.reviews || !Array.isArray(reviewsData.reviews) || reviewsData.reviews.length === 0) {
    return <SectionError sectionName="Reviews" error="No reviews found." data={reviewsData} />;
  }

  return (
    <section id="reviews" className="py-32 px-6 bg-[#FFFBF0]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#92400E] mb-8" />
          <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-normal font-bold tracking-wide text-[#1C1917] tracking-tighter mb-4 border-b-2 border-[#D97706] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
          {reviewsData.sectionSubtitle && (
            <p className="text-xl text-amber-900/80">{t(reviewsData, 'sectionSubtitle')}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsData.reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-[#FFFBF0] rounded-3xl border border-[#D97706]/20 hover:border-[#D97706]/40 p-8 transition-colors"
            >
              {/* Stars removed */}

              {/* Comment */}
              <p className="text-[#92400E] leading-relaxed mb-8 text-sm">
                "{t(review, 'comment')}"
              </p>

              {/* Reviewer info */}
              <div className="flex items-center gap-4">
                {review.avatar ? (
                  <img src={review.avatar} alt={t(review, 'name')} className="w-12 h-12 rounded-full object-cover border-2 border-[#D97706]/30" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#92400E]/20 border-2 border-[#D97706]/40 flex items-center justify-center">
                    <span className="text-[#D97706] font-sans font-bold tracking-normal font-bold tracking-wide text-lg">{(t(review, 'name') || '?')[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-[#1C1917] font-sans font-bold tracking-normal font-bold tracking-wide tracking-tight">{t(review, 'name')}</p>
                  {review.date && <p className="text-[#1C1917] text-xs">{typeof review.date === 'string' ? review.date : t(review, 'date') as string}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
