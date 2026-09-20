import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

async function run() {
  const client = new DynamoDBClient({ region: "ap-southeast-2" });
  const docClient = DynamoDBDocumentClient.from(client);

  try {
    // Get demo-theme1 content
    const getCommand = new GetCommand({
      TableName: "LP_Contents",
      Key: { store_id: "demo-theme1", RecordType: "LP_CONTENT" }
    });
    const response = await docClient.send(getCommand);
    const contentData = response.Item?.ContentData;

    if (!contentData) {
      console.error("demo-theme1 has no ContentData!");
      return;
    }

    // Get demo-theme5 current data
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

    // Update demo-theme5 with ContentData
    theme5Item.ContentData = contentData;
    theme5Item.templateId = "theme5"; 

    if (typeof theme5Item.ContentData === 'object' && theme5Item.ContentData !== null) {
      theme5Item.ContentData.templateId = "theme5";
    } else if (typeof theme5Item.ContentData === 'string') {
      try {
        let parsed = JSON.parse(theme5Item.ContentData);
        parsed.templateId = "theme5";
        theme5Item.ContentData = JSON.stringify(parsed);
      } catch (e) {}
    }
    
    const putCommand = new PutCommand({
      TableName: "LP_Contents",
      Item: theme5Item
    });
    
    await docClient.send(putCommand);
    console.log("Successfully updated demo-theme5 with ContentData from demo-theme1.");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
