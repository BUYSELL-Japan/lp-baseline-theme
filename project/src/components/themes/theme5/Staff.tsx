import { motion } from 'framer-motion';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Staff() {
  const staffData = useStaffData();
  const { getText } = useLocalize();

  if (!staffData || !staffData.members) return null;

  const sectionTitle = getText(staffData.sectionTitle);
  const sectionSubtitle = getText(staffData.sectionSubtitle);

  return (
    <section id="staff" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-0.5 h-10 bg-[#C0392B]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Staff</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-none tracking-tight">
            {sectionTitle}
          </h2>
          <div className="mt-3 w-16 h-0.5 bg-[#D4AF37]" />
        </motion.div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {staffData.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white group relative overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={member.image}
                  alt={getText(member.name)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                {/* Role overlay on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-950/80 py-3 px-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                    {getText(member.role)}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 border-t border-gray-200 group-hover:border-[#D4AF37] transition-colors">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  {getText(member.name)}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-6 h-px bg-[#D4AF37]" />
                  <div className="w-3 h-px bg-gray-300" />
                </div>
              </div>

              {/* Gold top-right corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
