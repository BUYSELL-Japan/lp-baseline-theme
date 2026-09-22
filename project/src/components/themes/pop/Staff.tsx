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

  if (!staffData.members || !Array.isArray(staffData.members) || staffData.members.length === 0) {
    return <SectionError sectionName="Staff" error="No staff members found." data={staffData} />;
  }

  const validMembers = staffData.members.filter((member: any) => {
    const name = t(member, 'name');
    return (name && name.trim() !== '') || (member.image && member.image.trim() !== '');
  });

  if (validMembers.length === 0) {
    return <SectionError sectionName="Staff" error="No valid staff members found." data={staffData} />;
  }

  return (
    <section id="staff" className="scroll-mt-20 bg-[#FFF9C4] py-16 sm:py-16 md:py-24 md:py-28 lg:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-[#7B2FBE] mb-8" />
          <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter mb-4 border-b-8 border-[#FB5607] pb-4 inline-block mb-4">
            {sectionTitle}
          </h2>
          {staffData.sectionSubtitle && (
            <p className="text-xl text-amber-900/80">{t(staffData, 'sectionSubtitle')}</p>
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
              className="group bg-[#FFFFFF] rounded-3xl border border-[#FFBE0B]/20 hover:border-[#FFBE0B]/40 overflow-hidden transition-colors"
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
                <p className="text-xs font-sans font-black tracking-tight uppercase tracking-[0.3em] text-[#FB5607] mb-2">
                  {t(member, 'role')}
                </p>
                <h3 className="text-2xl font-sans font-black tracking-tight text-[#2D2D2D] tracking-tighter mb-4">
                  {t(member, 'name')}
                </h3>
                <p className="text-amber-900/80 leading-relaxed text-sm">
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
