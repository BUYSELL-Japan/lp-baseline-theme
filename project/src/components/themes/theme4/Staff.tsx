import { motion } from 'framer-motion';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

export default function Staff() {
  const staffData = useStaffData();
  const { getText } = useLocalize();

  if (!staffData || !staffData.members) return null;

  const sectionTitle = getText(staffData.sectionTitle);
  const sectionSubtitle = getText(staffData.sectionSubtitle);

  const validMembers = staffData.members.filter((member) => {
    const name = getText(member.name);
    return (name && name.trim() !== '') || (member.image && member.image.trim() !== '');
  });

  if (validMembers.length === 0) return null;

  return (
    <section id="staff" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-red-50/10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-full h-64 bg-red-600 opacity-[0.02] -rotate-3 -translate-y-1/2" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-32 max-w-2xl"
        >
          <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-8 italic tracking-tighter leading-none">
            {sectionTitle}
          </h2>
          <div className="w-24 h-4 bg-yellow-400 rounded-full shadow-lg" />
        </motion.div>

        <div className={`grid grid-cols-1 ${
          validMembers.length === 1 ? 'max-w-sm mx-auto' : 
          validMembers.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 
          'md:grid-cols-2 lg:grid-cols-3'
        } gap-12 lg:gap-16`}>
          {validMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              className={`relative group ${
                index % 2 === 0 ? 'lg:-translate-y-12' : 'lg:translate-y-12'
              }`}
            >
              <div className="relative z-10 bg-white rounded-[4rem] p-4 shadow-2xl transition-transform duration-500 group-hover:-rotate-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3.5rem]">
                  <img
                    src={member.image}
                    alt={getText(member.name)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                    <h4 className="text-xl font-bold">{getText(member.role)}</h4>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl md:text-3xl font-black text-red-950 italic tracking-tighter">
                    {getText(member.name)}
                  </h3>
                  <div className="mt-4 flex justify-center gap-1">
                    <div className="w-8 h-1 bg-red-600 rounded-full" />
                    <div className="w-2 h-1 bg-yellow-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Background Decor */}
              <div className="absolute -inset-4 bg-yellow-400 opacity-0 group-hover:opacity-20 rounded-[4.5rem] blur-2xl transition-opacity -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
