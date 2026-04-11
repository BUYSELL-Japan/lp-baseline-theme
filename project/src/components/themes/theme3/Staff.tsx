import React from 'react';
import { motion } from 'framer-motion';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Staff() {
  const staffData = useStaffData();
  const { getText } = useLocalize();

  if (!staffData || !staffData.members || staffData.members.length === 0) return null;

  const sectionTitle = getText(staffData.sectionTitle);
  if (!sectionTitle) return null;

  return (
    <section id="staff" className="py-32 px-8 bg-stone-900 text-stone-100">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-16 border-b border-stone-700"
        >
          <div>
            <span className="font-serif text-xs tracking-[0.4em] uppercase text-amber-500 mb-4 block">Our Team</span>
            <h2 className="font-serif text-5xl md:text-6xl text-stone-100 font-light tracking-wide">
              {sectionTitle}
            </h2>
          </div>
          <p className="font-serif text-stone-500 text-base leading-relaxed max-w-xs mt-4 md:mt-0">
            {getText(staffData.sectionSubtitle)}
          </p>
        </motion.div>

        {/* Staff list — horizontal editorial strip, not card grid */}
        <div className="space-y-0">
          {staffData.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group grid grid-cols-[80px_1fr] md:grid-cols-[120px_200px_1fr] items-center gap-6 md:gap-10 py-10 border-b border-stone-800 last:border-none hover:border-stone-600 transition-colors duration-500"
            >
              {/* Index number */}
              <span className="font-serif text-4xl text-stone-700 group-hover:text-amber-800/40 transition-colors duration-700 font-light leading-none hidden md:block">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Photo — small, square, monochrome → color on hover */}
              <div className="w-20 h-20 md:w-full aspect-square overflow-hidden shrink-0">
                <img
                  src={member.image}
                  alt={getText(member.name)}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>

              {/* Text */}
              <div>
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-6 mb-3">
                  <h3 className="font-serif text-2xl text-stone-100 font-light tracking-wide">
                    {getText(member.name)}
                  </h3>
                  <span className="font-serif text-xs tracking-[0.3em] uppercase text-amber-500 mt-1 md:mt-0">
                    {getText(member.role)}
                  </span>
                </div>
                <p className="font-serif text-stone-500 text-sm leading-loose">
                  {getText(member.description)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
