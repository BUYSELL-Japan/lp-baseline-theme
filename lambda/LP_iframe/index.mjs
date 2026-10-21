import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDoc = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // --- 1. 動的な CORS 設定 ---
    const origin = event.headers?.origin || event.headers?.Origin || '';
    
    let allowOrigin = 'https://admin-lp.global-reaches.com'; 
    if (origin.endsWith('.global-reaches.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        allowOrigin = origin;
    }

    const CORS_HEADERS = {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const method = event.httpMethod || 'GET';

    // ============================
    // POST: templateId を保存
    // ============================
    if (method === 'POST') {
        try {
            const body = JSON.parse(event.body || '{}');
            const { storeId, templateId } = body;

            if (!storeId || !templateId) {
                return {
                    statusCode: 400,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ message: "storeId and templateId are required." })
                };
            }

            const validThemes = ["theme1", "theme2", "theme3"];
            if (!validThemes.includes(templateId)) {
                return {
                    statusCode: 400,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ message: `templateId must be one of: ${validThemes.join(", ")}` })
                };
            }

            await ddbDoc.send(new UpdateCommand({
                TableName: "Stores",
                Key: { store_id: storeId },
                UpdateExpression: "SET templateId = :templateId",
                ExpressionAttributeValues: { ":templateId": templateId }
            }));

            console.log(`templateId updated: ${storeId} → ${templateId}`);
            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify({ success: true, templateId })
            };
        } catch (error) {
            console.error("Update Error:", error);
            return {
                statusCode: 500,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: error.message })
            };
        }
    }

    // ============================
    // GET: 店舗設定を返す
    // ============================
    const storeId = event.pathParameters?.storeId;

    if (!storeId) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: "storeId is required in path" })
        };
    }

    try {
        let item = null;

        // 1. まず store_id としてそのまま検索
        const result = await ddbDoc.send(new GetCommand({
            TableName: "Stores",
            Key: { "store_id": storeId }
        }));

        if (result.Item) {
            item = result.Item;
        } else {
            // 2. 見つからなかった場合、storeIdに指定された値が「サブドメイン」である可能性を考慮して
            console.log(`Store not found by store_id, scanning by Subdomain: ${storeId}`);
            const scanResult = await ddbDoc.send(new ScanCommand({
                TableName: "Stores",
                FilterExpression: "Subdomain = :sub OR subdomain = :sub",
                ExpressionAttributeValues: { ":sub": storeId }
            }));
            
            if (scanResult.Items && scanResult.Items.length > 0) {
                item = scanResult.Items[0];
                console.log(`Found store via subdomain: ${item.store_id}`);
            }
        }

        if (!item) {
            return {
                statusCode: 404,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: "Store not found: " + storeId })
            };
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                // 既存フィールド（そのまま維持）
                Subdomain:            item.Subdomain || item.subdomain,
                subdomain:            item.subdomain || item.Subdomain,
                StoreName:            item.store_name_kanji,
                PlanType:             item.plan_type || 'Light',
                subscription_status:  item.subscription_status || 'inactive',
                // admin-ui が使うフィールド（追加・整合）
                planName:             item.plan_name || item.plan_type || null,
                trialEnd:             item.trial_end || null,
                templateId:           item.templateId || 'theme1',   
                contactEmail:         item.contact_email || null,
            })
        };

    } catch (error) {
        console.error("Database Error:", error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message })
        };
    }
};
