import React from 'react';
import { useStaffData } from '../../../contexts/PageDataContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getLocalizedValue } from '../../../utils/i18n';
import SectionError from '../../SectionError';

export default function Staff() {
  const staffData = useStaffData();
  const { language } = useLanguage();

  if (!staffData) return <SectionError sectionName="Staff" error="No staff data available" />;

  const sectionTitle = getLocalizedValue(staffData, 'sectionTitle', language);
  const members = staffData.members || [];

  return (
    <section id="staff" className="py-32 md:py-48 px-6" style={{ backgroundColor: '#111111', borderTop: '1px solid #D4541A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-24">
          <h2
            className="font-sans font-black tracking-[0.2em] uppercase text-[#FFFFFF] text-[2rem] md:text-[3rem]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
          >
            {sectionTitle || 'STAFF'}
          </h2>
          <div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>
        </div>

        <div className="flex flex-col space-y-12">
          {members.map((member, index) => {
            const name = getLocalizedValue(member, 'name', language);
            const role = getLocalizedValue(member, 'role', language);
            const description = getLocalizedValue(member, 'description', language);
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row bg-[#1C1C1C] border border-[#333333] transition-colors duration-300 hover:border-[#D4541A]"
              >
                {member.image ? (
                  <div className="w-full md:w-[30%] h-[300px] md:h-auto overflow-hidden flex-shrink-0" style={{ filter: 'grayscale(100%)' }}>
                    <img
                      src={member.image}
                      alt={name}
                      className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-[30%] h-[300px] md:h-auto flex-shrink-0 border-r border-[#333333]" />
                )}
                
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <div
                    className="font-sans text-sm tracking-[0.2em] uppercase mb-4"
                    style={{ fontFamily: 'monospace', color: '#D4541A', fontWeight: 700 }}
                  >
                    {role}
                  </div>
                  <h3
                    className="font-sans font-black text-[#FFFFFF] text-[2rem] md:text-[3rem] mb-6 tracking-widest"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900 }}
                  >
                    {name}
                  </h3>
                  <p
                    className="font-sans text-base text-[#BBBBBB] leading-loose tracking-wider"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
