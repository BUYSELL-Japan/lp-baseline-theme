import { motion } from 'framer-motion';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function Staff() {
  const staffData = useStaffData();
  const { t } = useLocalize();

  if (!staffData) return <SectionError sectionName="Staff" error="No staff data available" data={staffData} />;
  const sectionTitle = t(staffData, 'sectionTitle');
  if (!sectionTitle) return <SectionError sectionName="Staff" error="Missing section title" data={staffData} />;
  const validMembers = staffData.members.filter((member: any) => {
    const name = t(member, 'name');
    return (name && name.trim() !== '') || (member.image && member.image.trim() !== '');
  });

  if (!staffData.members || !Array.isArray(staffData.members) || validMembers.length === 0) {
    return <SectionError sectionName="Staff" error="No staff members found." data={staffData} />;
  }

  return (
    <section id="staff" className="bg-[#F5F0E8] text-[#1a1a1a] py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#C0392B] mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif tracking-widest text-[#1a1a1a] tracking-tighter mb-4 border-b-2 border-[#C0392B] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
          {staffData.sectionSubtitle && (
            <p className="text-xl text-[#1a1a1a]/80">{t(staffData, 'sectionSubtitle')}</p>
          )}
        </motion.div>

        <div className={`grid grid-cols-1 ${
          validMembers.length === 1 ? 'max-w-sm mx-auto' : 
          validMembers.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 
          'md:grid-cols-2 lg:grid-cols-3'
        } gap-6`}>
          {validMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
              whileHover={{ y: -8 }}
              className="group bg-transparent border border-[#1a1a1a]/20 rounded-3xl border border-[#C0392B]/20 hover:border-[#C0392B]/40 overflow-hidden transition-colors"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-[#F5F0E8] relative">
                <img
                  src={member.image}
                  alt={t(member, 'name')}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 to-transparent" />
              </div>

              {/* Info */}
              <div className="p-8">
                <p className="text-xs font-serif tracking-widest uppercase tracking-[0.3em] text-[#C0392B] mb-2">
                  {t(member, 'role')}
                </p>
                <h3 className="text-2xl font-serif tracking-widest text-[#1a1a1a] tracking-tighter mb-4">
                  {t(member, 'name')}
                </h3>
                <p className="text-[#1a1a1a]/80 leading-relaxed text-sm">
                  {t(member, 'description')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
