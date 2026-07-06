import { motion } from 'framer-motion';
import { useStaffData } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import SectionError from './SectionError';

export default function Staff() {
  const staffData = useStaffData();
  const { getText } = useLocalize();

  if (!staffData) {
    return <SectionError sectionName="Staff" error="No staff data available" data={staffData} />;
  }

  const sectionTitle = getText(staffData.sectionTitle);
  const sectionSubtitle = getText(staffData.sectionSubtitle);

  const validMembers = staffData.members.filter((member) => {
    const name = getText(member.name);
    return (name && name.trim() !== '') || (member.image && member.image.trim() !== '');
  });

  if (validMembers.length === 0) {
    return null;
  }

  if (!sectionTitle) {
    return <SectionError sectionName="Staff" error="Missing section title" data={staffData} />;
  }

  return (
    <section id="staff" className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-16 h-2 bg-theme-divider mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600">{sectionSubtitle}</p>
        </motion.div>

        <div className={`grid grid-cols-1 ${
          validMembers.length === 1 ? 'max-w-sm mx-auto' :
          validMembers.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' :
          validMembers.length === 3 ? 'md:grid-cols-3 max-w-4xl mx-auto' :
          'md:grid-cols-2 lg:grid-cols-4'
        } gap-8`}>
          {validMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
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
