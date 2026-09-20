import React from 'react';
import { motion } from 'framer-motion';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

export default function Staff() {
  const staffData = useStaffData();
  const { t } = useLocalize();

  if (!staffData || !staffData.members || staffData.members.length === 0) {
    return <SectionError sectionName="Staff" error="No staff data available" data={staffData} />;
  }

  const validMembers = staffData.members.filter((member: any) => {
    const name = t(member, 'name');
    return (name && name.trim() !== '') || (member.image && member.image.trim() !== '');
  });

  if (validMembers.length === 0) {
    return null;
  }

  return (
    <section id="staff" className="bg-[#FFFFFF] py-20 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#333333] mb-4">
            {t(staffData, 'sectionTitle')}
          </h2>
          {staffData.sectionSubtitle && (
            <p className="text-base text-[#333333]">{t(staffData, 'sectionSubtitle')}</p>
          )}
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
          {validMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#F8F8F8] border border-[#E5E5E5] flex flex-col"
            >
              {/* Image */}
              <div className="aspect-square w-full bg-[#E5E5E5] border-b border-[#E5E5E5] overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={t(member, 'name')}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[#333333]">No Image</div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <p className="text-sm font-sans font-bold text-[#2D6A4F] mb-1">
                  {t(member, 'role')}
                </p>
                <h3 className="text-xl font-sans font-bold text-[#333333] mb-3">
                  {t(member, 'name')}
                </h3>
                <p className="text-[#333333] leading-relaxed text-sm">
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
