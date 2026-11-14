// robots.txt / sitemap.xml / llms.txt のエンドポイント共通の getStaticPaths。
// フェーズ1の対象店舗（AI_SEO_SUBDOMAINS）だけ出力する。
import { fetchStoreContentAtBuildTime, getStoreList } from '../services/buildTimeApi';
import { mapDynamoDBDataToPageData } from '../services/dataMapper';
import { isAiSeoEnabled } from './seo';

export async function aiSeoStaticPaths() {
  const storeList = await getStoreList();
  const paths = [];
  for (const { storeId, subdomain } of storeList) {
    if (!subdomain || !isAiSeoEnabled(subdomain)) continue;
    const storeContent = await fetchStoreContentAtBuildTime(storeId);
    if (!storeContent) continue;
    const pageData = mapDynamoDBDataToPageData(storeContent);
    const updatedAt: string | undefined = storeContent.UpdatedAt || storeContent.updatedAt;
    paths.push({ params: { subdomain }, props: { pageData, subdomain, updatedAt } });
  }
  return paths;
}
