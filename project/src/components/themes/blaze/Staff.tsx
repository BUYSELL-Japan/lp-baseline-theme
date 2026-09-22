import React from 'react';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';

export default function Staff() {
  const staffData = useStaffData();
  const { language } = useLanguage();
  if (!staffData || !staffData.members || staffData.members.length === 0) return null;
  const sectionTitle = getLocalizedValue(staffData, 'sectionTitle', language) || 'Staff';

  return (
    <section id="staff" className="scroll-mt-20 py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-5xl md:text-7xl font-black text-center uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#EA580C]">
          {sectionTitle}
        </h2>
      </div>

      <div className="flex flex-col gap-8 max-w-7xl mx-auto px-6">
        {staffData.members.map((member, index) => {
          const name = getLocalizedValue(member, 'name', language);
          const role = getLocalizedValue(member, 'role', language);
          const desc = getLocalizedValue(member, 'description', language);
          const isDarker = index % 2 === 1;

          return (
            <div key={index} className={`flex flex-col sm:flex-row ${isDarker ? 'bg-[#171717]' : 'bg-[#111]'} p-6 sm:p-0 border-l-8 border-[#F59E0B]`}>
              {member.image && (
                <div className="w-full sm:w-1/3 md:w-1/4 aspect-square sm:aspect-auto h-[300px] sm:h-auto">
                  <img src={member.image} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
              <div className="w-full sm:w-2/3 md:w-3/4 p-6 sm:p-10 flex flex-col justify-center">
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-4xl font-black mb-2 uppercase">{name}</h3>
                  {role && <span className="text-[#DC2626] font-bold text-lg">{role}</span>}
                </div>
                {desc && (
                  <p className="text-gray-400 font-bold leading-relaxed max-w-3xl">
                    {desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
