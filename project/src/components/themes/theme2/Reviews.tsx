import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
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
    <section id="reviews" className="py-32 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-blue-500 mb-8" />
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            {sectionTitle}
          </h2>
          {reviewsData.sectionSubtitle && (
            <p className="text-xl text-slate-400">{t(reviewsData, 'sectionSubtitle')}</p>
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
              className="bg-slate-950 rounded-3xl border border-slate-800 hover:border-blue-500/40 p-8 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: review.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-blue-500 text-blue-500" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-slate-300 leading-relaxed mb-8 text-sm">
                "{t(review, 'comment')}"
              </p>

              {/* Reviewer info */}
              <div className="flex items-center gap-4">
                {review.avatar ? (
                  <img src={review.avatar} alt={t(review, 'name')} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border-2 border-blue-600/40 flex items-center justify-center">
                    <span className="text-blue-400 font-black text-lg">{(t(review, 'name') || '?')[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-white font-black tracking-tight">{t(review, 'name')}</p>
                  {review.date && <p className="text-slate-500 text-xs">{review.date}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
