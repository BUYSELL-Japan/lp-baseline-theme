import { createContext, useContext, ReactNode } from 'react';
import type { PageData } from '../services/dataMapper';
import { getDefaultPageData } from '../services/dataMapper';

const PageDataContext = createContext<PageData>(getDefaultPageData());

export function PageDataProvider({ children, data }: { children: ReactNode; data: PageData }) {
  return (
    <PageDataContext.Provider value={data}>
      {children}
    </PageDataContext.Provider>
  );
}

export function usePageData() {
  return useContext(PageDataContext);
}

export function useHeaderData() {
  const { header } = useContext(PageDataContext);
  return header;
}

export function useHeroData() {
  const { hero } = useContext(PageDataContext);
  return hero;
}

export function useAboutData() {
  const { about } = useContext(PageDataContext);
  return about;
}

export function useMenuData() {
  const { menu } = useContext(PageDataContext);
  return menu;
}

export function useStoreInfoData() {
  const { storeInfo } = useContext(PageDataContext);
  return storeInfo;
}

export function useContactData() {
  const { contact } = useContext(PageDataContext);
  return contact;
}

export function useFooterData() {
  const { footer } = useContext(PageDataContext);
  return footer;
}

export function useGalleryData() {
  const { gallery } = useContext(PageDataContext);
  return gallery;
}

export function useStaffData() {
  const { staff } = useContext(PageDataContext);
  return staff;
}

export function useReviewsData() {
  const { reviews } = useContext(PageDataContext);
  return reviews;
}

export function useNewsData() {
  const { news } = useContext(PageDataContext);
  return news;
}

export function useAccessData() {
  const { access } = useContext(PageDataContext);
  return access;
}

export function useFAQData() {
  const { faq } = useContext(PageDataContext);
  return faq;
}

export function useCTAData() {
  const { cta } = useContext(PageDataContext);
  return cta;
}

export function usePricingData() {
  const { pricing } = useContext(PageDataContext);
  return pricing;
}

export function useCompanyData() {
  const { company } = useContext(PageDataContext);
  return company;
}
