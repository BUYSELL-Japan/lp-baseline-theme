import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section id="reviews" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Huge Background Quote Icon */}
      <Quote className="absolute top-0 right-0 w-[40vw] h-[40vw] text-red-600 opacity-[0.02] translate-x-1/4 -translate-y-1/4" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end gap-12 mb-24">
          <div className="flex-1">
            <h2 className="text-6xl md:text-9xl font-black text-rose-950 mb-8 italic tracking-tighter leading-none">
              {sectionTitle}
            </h2>
            <div className="w-32 h-6 bg-yellow-400 rounded-full" />
          </div>
          <p className="flex-1 text-2xl font-black text-orange-900/40 italic">
            {sectionSubtitle}
          </p>
        </div>

        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="bg-amber-50 rounded-[4rem] p-10 md:p-20 relative overflow-hidden"
          >
            <Quote className="absolute top-10 left-10 w-24 h-24 text-red-600 opacity-10" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-48 h-48 shrink-0 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl rotate-3">
                <img
                  src={reviews[activeIndex].avatar}
                  alt={getText(reviews[activeIndex].name)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-8">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < reviews[activeIndex].rating
                          ? 'fill-red-600 text-red-600'
                          : 'text-red-100'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-3xl md:text-5xl font-black text-rose-950 leading-tight italic tracking-tighter">
                  "{getText(reviews[activeIndex].comment)}"
                </p>

                <div className="pt-8 border-t border-red-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-red-600">{getText(reviews[activeIndex].name)}</h3>
                    <p className="text-sm font-bold text-orange-900/40 uppercase tracking-widest">{getText(reviews[activeIndex].date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12 justify-end">
            <button
              onClick={prevReview}
              className="w-16 h-16 rounded-full border-4 border-red-600 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextReview}
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-yellow-200 shadow-xl shadow-red-500/20 hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
