import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function Theme2StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  // 動的言語取得（日本語向け）
  const getLocalText = (field: any, lang: string = 'ja') => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['ja'] || '';
  };

  const storeName = getLocalText(pageData.header?.logo?.text);

  return (
    <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
      <PageDataProvider data={pageData}>
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-8">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight">Theme 2: Modern</h1>
            <p className="text-xl text-slate-400">ここは {storeName} のTheme 2ページ（モック）です。</p>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
              <p className="text-sm text-slate-300">
                管理画面で「Theme 2」が選択されると、Astroのビルドプロセスを通じ、現在ご覧のレイアウトファイルが使用されて静的ページが生成されます。<br/>
                ※後続のステップで実際のおしゃれなデザインコンポーネントに差し替えます。
              </p>
            </div>
          </div>
        </div>
      </PageDataProvider>
    </LanguageProvider>
  );
}
