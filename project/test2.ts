import { fetchStoreContentAtBuildTime, getStoreList } from "./src/services/buildTimeApi.ts";
import { mapDynamoDBDataToPageData } from "./src/services/dataMapper.ts";

async function run() {
  const storeList = await getStoreList();
  console.log("StoreList length:", storeList.length);
  
  const paths = await Promise.all(
    storeList.map(async ({ storeId, subdomain, contact_email, templateId }) => {
      console.log(`Processing ${storeId} / ${subdomain}`);
      const storeContent = await fetchStoreContentAtBuildTime(storeId);
      if (!storeContent) {
        console.log(`NO CONTENT FOR ${storeId}`);
        return null;
      }
      return { subdomain, storeId, templateId };
    })
  );
  
  const valid = paths.filter(Boolean);
  console.log("Valid paths count:", valid.length);
  console.log(valid);
}

run().catch(console.error);
