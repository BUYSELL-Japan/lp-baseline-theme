import type { PageData } from '../services/dataMapper';
import { PageDataProvider } from '../contexts/PageDataContext';
import { LanguageProvider } from '../contexts/LanguageContext';

interface StorePageProps {
  pageData: PageData;
  initialLanguage?: 'ja' | 'en' | 'zh-tw' | 'ko';
  basePath?: string;
}

export default function Theme3StorePage({ pageData, initialLanguage = 'ja', basePath = '/' }: StorePageProps) {
  // 動的言語取得
  const getLocalText = (field: any, lang: string = 'ja') => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['ja'] || '';
  };

  const storeName = getLocalText(pageData.header?.logo?.text);

  return (
    <LanguageProvider initialLanguage={initialLanguage} basePath={basePath}>
      <PageDataProvider data={pageData}>
        <div className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center p-8 font-serif">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-light tracking-wide text-amber-800">Theme 3: Elegant</h1>
            <p className="text-xl text-stone-600">ここは {storeName} のTheme 3ページ（モック）です。</p>
            <div className="p-8 bg-white rounded shadow-sm border border-stone-200">
              <p className="text-sm text-stone-500 leading-relaxed">
                管理画面で「Theme 3」が選択されると、Astroのビルドプロセスを通じ、現在ご覧のエレガントなレイアウトファイルが使用されて静的ページが生成されます。<br/>
                ※後続のステップで専用デザインに差し替えます。
              </p>
            </div>
          </div>
        </div>
      </PageDataProvider>
    </LanguageProvider>
  );
}
