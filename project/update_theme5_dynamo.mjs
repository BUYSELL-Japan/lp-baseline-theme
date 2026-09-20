import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

async function run() {
  const client = new DynamoDBClient({ region: "ap-southeast-2" });
  const docClient = DynamoDBDocumentClient.from(client);

  try {
    const getTheme5 = new GetCommand({
      TableName: "LP_Contents",
      Key: { store_id: "demo-theme5", RecordType: "LP_CONTENT" }
    });
    const theme5Res = await docClient.send(getTheme5);
    const theme5Item = theme5Res.Item;

    if (!theme5Item) {
      console.error("demo-theme5 not found!");
      return;
    }

    if (typeof theme5Item.ContentData === 'string') {
      try {
        let parsed = JSON.parse(theme5Item.ContentData);
        if (!parsed.settings) parsed.settings = {};
        parsed.settings.theme = "theme5";
        theme5Item.ContentData = JSON.stringify(parsed);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    } else if (typeof theme5Item.ContentData === 'object' && theme5Item.ContentData !== null) {
      if (!theme5Item.ContentData.settings) theme5Item.ContentData.settings = {};
      theme5Item.ContentData.settings.theme = "theme5";
    }
    
    const putCommand = new PutCommand({
      TableName: "LP_Contents",
      Item: theme5Item
    });
    
    await docClient.send(putCommand);
    console.log("Successfully updated demo-theme5 settings.theme to theme5.");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
