import { createContext, useContext, useState, ReactNode } from 'react';
import type { PageData } from '../services/dataMapper';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  pageData: PageData;
  updatePageData: (updates: Partial<PageData>) => void;
  updateSectionData: <K extends keyof PageData>(section: K, data: PageData[K]) => void;
  isDirty: boolean;
  markAsSaved: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

interface EditModeProviderProps {
  children: ReactNode;
  initialData: PageData;
}

export function EditModeProvider({ children, initialData }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageData, setPageData] = useState<PageData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const updatePageData = (updates: Partial<PageData>) => {
    setPageData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const updateSectionData = <K extends keyof PageData>(section: K, data: PageData[K]) => {
    setPageData((prev) => ({ ...prev, [section]: data }));
    setIsDirty(true);
  };

  const markAsSaved = () => {
    setIsDirty(false);
  };

  return (
    <EditModeContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        pageData,
        updatePageData,
        updateSectionData,
        isDirty,
        markAsSaved,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
