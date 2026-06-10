import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReviewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Reviews() {
  const reviewsData = useReviewsData();
  const { getText } = useLocalize();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!reviewsData || !reviewsData.reviews) return null;

  const sectionTitle = getText(reviewsData.sectionTitle);
  const sectionSubtitle = getText(reviewsData.sectionSubtitle);
  const reviews = reviewsData.reviews;

  const nextReview = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-gray-950 relative overflow-hidden">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />

      {/* Large cymbal disc decoration */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 border border-[#D4AF37]/10 rounded-full pointer-events-none hidden lg:block" />
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-40 h-40 border border-[#D4AF37]/20 rounded-full pointer-events-none hidden lg:block" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-0.5 h-10 bg-[#C0392B]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Reviews</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-none tracking-tight">
              {sectionTitle}
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-[#D4AF37]" />
          </div>
          <p className="text-sm text-gray-500 max-w-sm font-medium leading-relaxed">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Review card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="border border-gray-800 bg-gray-900 p-8 lg:p-14 relative"
            >
              {/* Gold top-left corner */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#D4AF37]" />

              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 overflow-hidden border border-gray-700">
                    <img
                      src={reviews[activeIndex].avatar}
                      alt={getText(reviews[activeIndex].name)}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < reviews[activeIndex].rating
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xl lg:text-2xl font-bold text-gray-200 leading-relaxed mb-8">
                    "{getText(reviews[activeIndex].comment)}"
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-800 pt-6">
                    <div>
                      <h3 className="text-base font-black text-[#D4AF37] uppercase tracking-wider">
                        {getText(reviews[activeIndex].name)}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                        {getText(reviews[activeIndex].date)}
                      </p>
                    </div>
                    {/* Counter */}
                    <div className="text-[10px] font-black text-gray-700 tracking-widest">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-0 mt-px">
            <button
              onClick={prevReview}
              className="w-14 h-14 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextReview}
              className="w-14 h-14 border border-gray-700 border-l-0 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gold bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
    </section>
  );
}
