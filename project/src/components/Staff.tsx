import { motion } from 'framer-motion';
import { useStaffData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import SectionError from './SectionError';

export default function Staff() {
  const staffData = useStaffData();
  const { getText } = useLocalize();

  console.log('[Staff] staffData:', staffData);

  if (!staffData) {
    console.log('[Staff] No staffData');
    return <SectionError sectionName="Staff" error="No staff data available" data={staffData} />;
  }

  const sectionTitle = getText(staffData.sectionTitle);
  const sectionSubtitle = getText(staffData.sectionSubtitle);

  console.log('[Staff] sectionTitle:', sectionTitle);
  console.log('[Staff] members:', staffData.members);

  if (!sectionTitle) {
    return <SectionError sectionName="Staff" error="Missing section title" data={staffData} />;
  }

  if (!staffData.members || staffData.members.length === 0) {
    console.log('[Staff] Missing members array');
    return <SectionError sectionName="Staff" error="No staff members found. Expected 'members' array in data." data={staffData} />;
  }

  return (
    <section id="staff" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-theme-divider mx-auto mb-6" />
          <p className="text-xl text-gray-700">{sectionSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffData.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 relative overflow-hidden">
                <motion.img
                  src={member.image}
                  alt={getText(member.name)}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{getText(member.name)}</h3>
                <p className="text-theme-primary font-medium mb-3">{getText(member.role)}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
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
