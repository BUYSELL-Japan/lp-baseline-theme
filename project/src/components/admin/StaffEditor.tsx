import { Trash2, Plus } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { useEditMode } from '../../contexts/EditModeContext';

export default function StaffEditor() {
  const { pageData, updateSectionData } = useEditMode();
  const staffData = pageData.staff;

  if (!staffData) return null;

  const members = Array.isArray(staffData.members) ? staffData.members : [];

  const handleImageUpload = (index: number, s3Url: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      image: s3Url,
    };
    updateSectionData('staff', {
      ...staffData,
      members: updatedMembers,
    });
  };

  const handleMemberFieldChange = (index: number, field: string, value: any) => {
    const updatedMembers = [...members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };
    updateSectionData('staff', {
      ...staffData,
      members: updatedMembers,
    });
  };

  const handleAddMember = () => {
    const newMember = {
      name: { ja: '', en: '', ko: '', 'zh-tw': '' },
      role: { ja: '', en: '', ko: '', 'zh-tw': '' },
      description: { ja: '', en: '', ko: '', 'zh-tw': '' },
      image: '',
    };
    updateSectionData('staff', {
      ...staffData,
      members: [...members, newMember],
    });
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    updateSectionData('staff', {
      ...staffData,
      members: updatedMembers,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Section</h2>
          <p className="text-sm text-gray-600 mt-1">Manage team members</p>
        </div>
        <button
          onClick={handleAddMember}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="space-y-8">
        {members.map((member: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">Member {index + 1}</h3>
              <button
                onClick={() => handleRemoveMember(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <ImageUpload
              label="Profile Image"
              currentImageUrl={member.image}
              onImageUploaded={(s3Url) => handleImageUpload(index, s3Url)}
              aspectRatio="1/1"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof member.name === 'object' ? member.name.ja || '' : member.name || ''}
                  onChange={(e) => {
                    const current = typeof member.name === 'object' ? member.name : {};
                    handleMemberFieldChange(index, 'name', { ...current, ja: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="名前"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (English)
                </label>
                <input
                  type="text"
                  value={typeof member.name === 'object' ? member.name.en || '' : ''}
                  onChange={(e) => {
                    const current = typeof member.name === 'object' ? member.name : {};
                    handleMemberFieldChange(index, 'name', { ...current, en: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof member.role === 'object' ? member.role.ja || '' : member.role || ''}
                  onChange={(e) => {
                    const current = typeof member.role === 'object' ? member.role : {};
                    handleMemberFieldChange(index, 'role', { ...current, ja: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="役職"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role (English)
                </label>
                <input
                  type="text"
                  value={typeof member.role === 'object' ? member.role.en || '' : ''}
                  onChange={(e) => {
                    const current = typeof member.role === 'object' ? member.role : {};
                    handleMemberFieldChange(index, 'role', { ...current, en: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Role"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Japanese)
                </label>
                <textarea
                  value={typeof member.description === 'object' ? member.description.ja || '' : member.description || ''}
                  onChange={(e) => {
                    const current = typeof member.description === 'object' ? member.description : {};
                    handleMemberFieldChange(index, 'description', { ...current, ja: e.target.value });
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="説明"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={typeof member.description === 'object' ? member.description.en || '' : ''}
                  onChange={(e) => {
                    const current = typeof member.description === 'object' ? member.description : {};
                    handleMemberFieldChange(index, 'description', { ...current, en: e.target.value });
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
        ))}

        {members.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No team members yet. Click "Add Member" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
