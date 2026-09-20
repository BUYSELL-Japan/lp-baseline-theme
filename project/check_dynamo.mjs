import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

async function run() {
  const client = new DynamoDBClient({ region: "ap-southeast-2" });
  const docClient = DynamoDBDocumentClient.from(client);
  const getTheme5 = new GetCommand({
    TableName: "LP_Contents",
    Key: { store_id: "demo-theme5", RecordType: "LP_CONTENT" }
  });
  const res = await docClient.send(getTheme5);
  console.log("Template ID:", res.Item.templateId);
  console.log("Settings Theme:", res.Item.ContentData.settings?.theme);
}
run();
