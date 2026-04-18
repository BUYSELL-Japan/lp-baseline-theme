import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useReviewsData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Reviews() {
  const reviewsData = useReviewsData();
  const { getText } = useLocalize();

  if (!reviewsData || !reviewsData.reviews) return null;

  const sectionTitle = getText(reviewsData.sectionTitle);
  const sectionSubtitle = getText(reviewsData.sectionSubtitle);

  return (
    <section id="reviews" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Voice of Tropical</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviewsData.reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-amber-50 rounded-[3rem] p-10 relative group border-2 border-transparent hover:border-red-500 transition-all duration-300"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-red-100 group-hover:text-red-200 transition-colors" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-1 rounded-full bg-red-600">
                  <img
                    src={review.avatar}
                    alt={getText(review.name)}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div>
                  <h3 className="font-black text-rose-900 text-lg">{getText(review.name)}</h3>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{getText(review.date)}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'fill-red-500 text-red-500'
                        : 'text-red-100'
                    }`}
                  />
                ))}
              </div>

              <p className="text-lg font-bold text-orange-950/70 leading-relaxed italic">
                "{getText(review.comment)}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
