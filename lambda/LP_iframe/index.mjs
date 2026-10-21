import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { authorizeStoreAccess } from "./cognitoAuth.mjs";

const ddbClient = new DynamoDBClient({ region: "ap-southeast-2" });
const ddbDoc = DynamoDBDocumentClient.from(ddbClient);

const CONTENTS_TABLE = "LP_Contents";

// lp-baseline-theme の店舗ページが描画できるテーマ（src/pages/stores/[subdomain]/index.astro と揃える）
const VALID_THEMES = [
    "theme1", "theme2", "theme3", "theme4", "theme5",
    "ember", "blaze", "char", "warm", "kura", "shiro", "brush", "mist", "pop"
];

// テーマ変更を公開中のLPに反映させるため、LP_SaveContent と同じ Cloudflare の Deploy Hook を叩く
const CLOUDFLARE_WEBHOOK_URL = process.env.CLOUDFLARE_WEBHOOK_URL;

const triggerCloudflareWebhook = async () => {
    if (!CLOUDFLARE_WEBHOOK_URL) {
        console.error("CLOUDFLARE_WEBHOOK_URL is not set. Skipping deploy hook.");
        return false;
    }
    try {
        const res = await fetch(CLOUDFLARE_WEBHOOK_URL, { method: "POST" });
        console.log(`Cloudflare webhook triggered: ${res.status}`);
        return res.ok;
    } catch (err) {
        console.error("Cloudflare webhook error:", err);
        return false;
    }
};

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

            if (!VALID_THEMES.includes(templateId)) {
                return {
                    statusCode: 400,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ message: `templateId must be one of: ${VALID_THEMES.join(", ")}` })
                };
            }

            // Cognito IDトークンを検証し、この店舗の所有者か確認する
            const auth = await authorizeStoreAccess(event, storeId, ddbDoc);
            if (!auth.ok) {
                return {
                    statusCode: auth.statusCode,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ message: auth.message })
                };
            }

            try {
                await ddbDoc.send(new UpdateCommand({
                    TableName: "Stores",
                    Key: { store_id: storeId },
                    UpdateExpression: "SET templateId = :templateId",
                    ConditionExpression: "attribute_exists(store_id)",
                    ExpressionAttributeValues: { ":templateId": templateId }
                }));
            } catch (err) {
                if (err.name === "ConditionalCheckFailedException") {
                    return {
                        statusCode: 404,
                        headers: CORS_HEADERS,
                        body: JSON.stringify({ message: "Store not found: " + storeId })
                    };
                }
                throw err;
            }

            // 店舗ページは ContentData.templateId → Stores.templateId の順に優先するため、
            // ContentData 側に値があれば同じテーマに揃える（無い店舗は Stores.templateId だけで反映される）
            try {
                await ddbDoc.send(new UpdateCommand({
                    TableName: CONTENTS_TABLE,
                    Key: { store_id: storeId },
                    UpdateExpression: "SET ContentData.templateId = :templateId",
                    ConditionExpression: "attribute_exists(ContentData.templateId)",
                    ExpressionAttributeValues: { ":templateId": templateId }
                }));
            } catch (err) {
                if (err.name !== "ConditionalCheckFailedException") throw err;
            }

            // 公開中のLPなら再ビルドして反映する
            const { Item: content } = await ddbDoc.send(new GetCommand({
                TableName: CONTENTS_TABLE,
                Key: { store_id: storeId },
                ProjectionExpression: "#s",
                ExpressionAttributeNames: { "#s": "Status" }
            }));
            const deployTriggered = content?.Status === "Published" ? await triggerCloudflareWebhook() : false;

            console.log(`templateId updated: ${storeId} → ${templateId} (deployTriggered: ${deployTriggered})`);
            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify({ success: true, templateId, deployTriggered })
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
