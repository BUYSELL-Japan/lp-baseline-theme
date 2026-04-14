import { fetchStoreContentAtBuildTime } from "./src/services/buildTimeApi.ts";
import { mapDynamoDBDataToPageData } from "./src/services/dataMapper.ts";

fetchStoreContentAtBuildTime("01KP1TR2KAEG7Q64BP67RNAW3E").then(d => {
  try {
    const pageData = mapDynamoDBDataToPageData(d);
    console.log("SUCCESS");
  } catch(e) {
    console.error("ERROR:", e);
  }
}).catch(console.error);
