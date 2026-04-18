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
    <section id="staff" className="py-32 px-6 bg-amber-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-100 rounded-full blur-[80px] -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Our Family</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {staffData.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[3rem] p-3 shadow-[0_15px_40px_rgba(251,191,36,0.1)] group transition-all duration-300 hover:shadow-[0_20px_60px_rgba(239,68,68,0.15)]"
            >
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative">
                <img
                  src={member.image}
                  alt={getText(member.name)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent" />
              </div>
              <div className="p-8 text-center">
                <div className="inline-block px-4 py-1.5 bg-yellow-400 text-rose-900 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 shadow-sm">
                  {getText(member.role)}
                </div>
                <h3 className="text-2xl font-black text-rose-900 mb-2">{getText(member.name)}</h3>
                <p className="text-sm font-bold text-orange-950/50 leading-relaxed italic">
                  "{getText(member.description)}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
