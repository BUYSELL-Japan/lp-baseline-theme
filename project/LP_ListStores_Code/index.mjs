import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";

const CONTENTS_TABLE = process.env.TABLE_NAME || 'LP_Contents';
const STORES_TABLE = process.env.STORES_TABLE_NAME || 'Stores';
const REGION = process.env.AWS_REGION || 'ap-southeast-2';

// LP_StripeWebhook の HIDDEN_STATUSES と揃える
const HIDDEN_STATUSES = ['unpaid', 'canceled'];

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const CORS_HEADERS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const scanParams = {
        TableName: CONTENTS_TABLE,
        ProjectionExpression: 'store_id, Subdomain, #s, RecordType',
        FilterExpression: 'RecordType = :recordType AND #s = :publishedStatus',
        ExpressionAttributeNames: { '#s': 'Status' },
        ExpressionAttributeValues: {
            ':recordType': 'LP_CONTENT',
            ':publishedStatus': 'Published'
        }
    };

    try {
        const result = await ddb.send(new ScanCommand(scanParams));

        if (result.Items.length === 0) {
            return {
                statusCode: 200,
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
                body: JSON.stringify({ count: 0, stores: [] })
            };
        }

        const storeIds = result.Items.map(item => item.store_id);

        const batchKeys = storeIds.map(id => ({ store_id: id }));
        const batchGetParams = {
            RequestItems: {
                [STORES_TABLE]: {
                    Keys: batchKeys,
                    // ★ templateId を追加
                    ProjectionExpression: 'store_id, contact_email, templateId, subscription_status'
                }
            }
        };

        const batchResult = await ddb.send(new BatchGetCommand(batchGetParams));
        const storesData = batchResult.Responses[STORES_TABLE] || [];

        const storeInfoMap = storesData.reduce((acc, store) => {
            acc[store.store_id] = store;
            return acc;
        }, {});

        // 未払い（unpaid）・解約（canceled）の店舗は公開しない。past_due（再請求中）は公開を続ける。
        // デモ店舗（store_id が demo- で始まる）は常に公開する
        const isPublishable = (item) => {
            if (String(item.store_id).startsWith('demo-')) return true;
            const status = storeInfoMap[item.store_id]?.subscription_status;
            if (HIDDEN_STATUSES.includes(status)) {
                console.log(`Excluding store ${item.store_id} (subscription_status: ${status})`);
                return false;
            }
            return true;
        };

        const stores = result.Items.filter(isPublishable).map(item => {
            const storeInfo = storeInfoMap[item.store_id] || {};
            return {
                storeId:       item.store_id,
                subdomain:     item.Subdomain,
                contact_email: storeInfo.contact_email || "",
                templateId:    storeInfo.templateId || "theme1"  // ★ 追加
            };
        });

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            body: JSON.stringify({ count: stores.length, stores })
        };

    } catch (error) {
        console.error('Error listing stores:', error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Failed to list stores.', error: error.message }),
        };
    }
};
