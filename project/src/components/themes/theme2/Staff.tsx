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

  return (
    <section id="staff" className="py-32 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="w-16 h-1 bg-blue-500 mb-8" />
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            {sectionTitle}
          </h2>
          {staffData.sectionSubtitle && (
            <p className="text-xl text-slate-400">{t(staffData, 'sectionSubtitle')}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffData.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/40 overflow-hidden transition-colors"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-slate-800 relative">
                <img
                  src={member.image}
                  alt={t(member, 'name')}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>

              {/* Info */}
              <div className="p-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-2">
                  {t(member, 'role')}
                </p>
                <h3 className="text-2xl font-black text-white tracking-tighter mb-4">
                  {t(member, 'name')}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
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
