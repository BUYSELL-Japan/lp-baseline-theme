import React from 'react';
import { motion } from 'framer-motion';
import { useReviewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Reviews() {
  const reviewsData = useReviewsData();
  const { getText } = useLocalize();

  if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) return null;

  const sectionTitle = getText(reviewsData.sectionTitle);
  if (!sectionTitle) return null;

  return (
    <section id="reviews" className="py-32 px-8 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <div className="w-8 h-px bg-amber-700 mx-auto mb-8" />
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 font-light tracking-wider mb-3">
            {sectionTitle}
          </h2>
          <p className="font-serif text-stone-500 text-base tracking-wide font-light">
            {getText(reviewsData.sectionSubtitle)}
          </p>
          <div className="w-8 h-px bg-amber-700 mx-auto mt-8" />
        </motion.div>

        {/* Reviews — Pull-quote style, not card grid */}
        <div className="space-y-0">
          {reviewsData.reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-center py-12 border-b border-stone-200 last:border-none"
            >
              {/* Left: Quote */}
              <div>
                {/* Stars as typographic dots */}
                <div className="flex gap-1.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i < review.rating ? 'bg-amber-600' : 'bg-stone-300'}`}
                    />
                  ))}
                </div>
                {/* Pull quote with oversized opening mark */}
                <blockquote className="relative">
                  <span className="absolute -top-6 -left-4 font-serif text-7xl text-amber-200 leading-none select-none pointer-events-none">"</span>
                  <p className="font-serif text-xl md:text-2xl text-stone-700 font-light leading-relaxed italic pl-4">
                    {getText(review.comment)}
                  </p>
                </blockquote>
              </div>

              {/* Right: Reviewer info — understated */}
              <div className="flex items-center gap-4 md:flex-col md:items-end md:text-right">
                <div className="w-14 h-14 overflow-hidden rounded-full shrink-0 border border-stone-200">
                  <img
                    src={review.avatar}
                    alt={getText(review.name)}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div>
                  <div className="font-serif text-stone-800 font-medium tracking-wide">
                    {getText(review.name)}
                  </div>
                  <div className="font-serif text-stone-400 text-xs tracking-widest mt-1">
                    {getText(review.date)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
