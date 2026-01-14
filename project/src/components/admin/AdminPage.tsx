import { useState } from 'react';
import { Save, Loader2, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import { EditModeProvider, useEditMode } from '../../contexts/EditModeContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { PageDataProvider } from '../../contexts/PageDataContext';
import type { PageData } from '../../services/dataMapper';
import { saveStoreContent } from '../../utils/contentApi';
import HeroEditor from './HeroEditor';
import GalleryEditor from './GalleryEditor';
import StaffEditor from './StaffEditor';
import MenuEditor from './MenuEditor';
import StorePage from '../StorePage';

interface AdminPageProps {
  pageData: PageData;
  storeId: string;
}

function AdminContent({ storeId }: { storeId: string }) {
  const { pageData, isDirty, markAsSaved } = useEditMode();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      console.log('Saving data for store:', storeId);
      console.log('Page data:', pageData);

      const result = await saveStoreContent(storeId, pageData);

      if (result.success) {
        markAsSaved();
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Save failed:', result.error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'hero', label: 'Hero', component: HeroEditor },
    { id: 'menu', label: 'Menu', component: MenuEditor },
    { id: 'gallery', label: 'Gallery', component: GalleryEditor },
    { id: 'staff', label: 'Staff', component: StaffEditor },
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || HeroEditor;

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Preview Mode</h1>
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Exit Preview
            </button>
          </div>
        </div>
        <LanguageProvider>
          <PageDataProvider data={pageData}>
            <StorePage pageData={pageData} />
          </PageDataProvider>
        </LanguageProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
              <p className="text-sm text-gray-600 mt-1">Store ID: {storeId}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isDirty && !isSaving
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Error
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sections</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="col-span-9">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage({ pageData, storeId }: AdminPageProps) {
  return (
    <EditModeProvider initialData={pageData}>
      <AdminContent storeId={storeId} />
    </EditModeProvider>
  );
}
