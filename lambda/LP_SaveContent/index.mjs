import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import https from 'https';
import { authorizeStoreAccess } from './cognitoAuth.mjs';

const TABLE_NAME = process.env.TABLE_NAME || 'LP_Contents'; 
const STORES_TABLE = 'Stores'; 
const REGION = process.env.AWS_REGION || 'ap-southeast-2';

const S3_DOMAIN = "lp-store-images.s3.ap-southeast-2.amazonaws.com";
const CLOUDFRONT_DOMAIN = "d1bgs7tj36vb93.cloudfront.net";

// CloudflareのDeploy Hook URL（Lambdaの環境変数から取得）
const CLOUDFLARE_WEBHOOK_URL = process.env.CLOUDFLARE_WEBHOOK_URL;

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://admin-lp.global-reaches.com',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Credentials': 'true'
};

/**
 * URLをCloudFrontドメインに置換し、かつ /stores/ パスを削除する
 */
const replaceS3Urls = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'string' && obj.includes(S3_DOMAIN)) {
            let url = obj.replace(new RegExp(S3_DOMAIN, 'g'), CLOUDFRONT_DOMAIN);
            url = url.replace(`${CLOUDFRONT_DOMAIN}/stores/`, `${CLOUDFRONT_DOMAIN}/`);
            return url;
        }
        return obj;
    }
    if (Array.isArray(obj)) return obj.map(replaceS3Urls);
    const newObj = {};
    for (const key in obj) {
        newObj[key] = replaceS3Urls(obj[key]);
    }
    return newObj;
};

/**
 * CloudflareのDeployフックをサーバーサイドから叩く
 */
const triggerCloudflareWebhook = () => {
    return new Promise((resolve) => {
        if (!CLOUDFLARE_WEBHOOK_URL) {
            console.error('CLOUDFLARE_WEBHOOK_URL is not set. Skipping deploy hook.');
            return resolve(false);
        }
        const url = new URL(CLOUDFLARE_WEBHOOK_URL);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: { 'Content-Length': 0 }
        };
        const req = https.request(options, (res) => {
            console.log(`Cloudflare webhook triggered: ${res.statusCode}`);
            resolve(res.statusCode >= 200 && res.statusCode < 300);
        });
        req.on('error', (err) => {
            console.error('Cloudflare webhook error:', err);
            resolve(false);
        });
        req.end();
    });
};

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };

    try {
        const requestBody = JSON.parse(event.body || '{}');
        const inputStoreID = requestBody.store_id || requestBody.storeId || requestBody.StoreID;
        let inputContentData = requestBody.content || requestBody.ContentData;

        if (inputContentData && inputContentData.content && typeof inputContentData.content === 'object') {
            inputContentData = inputContentData.content;
        }

        if (!inputStoreID || !inputContentData) {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ message: 'Missing data' }) };
        }

        // Cognito IDトークンを検証し、この店舗の所有者か確認する
        const auth = await authorizeStoreAccess(event, inputStoreID, ddb);
        if (!auth.ok) {
            return { statusCode: auth.statusCode, headers: CORS_HEADERS, body: JSON.stringify({ message: auth.message }) };
        }

        // URLのドメイン置換とパス最適化
        const processedContentData = replaceS3Urls(inputContentData);

        // 店舗情報の取得
        const storeResult = await ddb.send(new GetCommand({
            TableName: STORES_TABLE,
            Key: { 'store_id': inputStoreID }
        }));

        // ★修正箇所: 大文字・小文字どちらも考慮し、より安全に取得する
        const storeItem = storeResult.Item;
        let subdomain = storeItem?.Subdomain || storeItem?.subdomain || requestBody.Subdomain || requestBody.subdomain || null;

        if (!subdomain) {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ message: 'Subdomain not found' }) };
        }

        // Statusの判定（既存のStatusを取得して保持、明示的に指定された場合のみ上書き）
        const requestedStatus = requestBody.Status || requestBody.status;
        let finalStatus = 'Draft'; 

        if (requestedStatus) {
            finalStatus = requestedStatus;
        } else {
            try {
                const existingItem = await ddb.send(new GetCommand({
                    TableName: TABLE_NAME,
                    Key: { 'store_id': inputStoreID }
                }));
                if (existingItem.Item?.Status) {
                    finalStatus = existingItem.Item.Status;
                    console.log(`Preserving existing Status: ${finalStatus}`);
                }
            } catch (e) {
                console.warn('Could not fetch existing status, defaulting to Draft:', e.message);
            }
        }

        const now = new Date().toISOString();
        const params = {
            TableName: TABLE_NAME,
            Item: {
                'store_id': inputStoreID,
                'RecordType': 'LP_CONTENT',
                'Subdomain': subdomain,
                'Status': finalStatus,
                'CreatedAt': requestBody.CreatedAt || requestBody.createdAt || now,
                'UpdatedAt': now,
                'ContentData': processedContentData,
            },
        };

        await ddb.send(new PutCommand(params));

        // Status が 'Published' の場合、Cloudflare Webhookを叩く
        if (finalStatus === 'Published') {
            console.log('Status is Published. Triggering Cloudflare deploy webhook...');
            const webhookResult = await triggerCloudflareWebhook();
            console.log(`Cloudflare webhook result: ${webhookResult}`);

            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify({ 
                    message: 'Success', 
                    store_id: inputStoreID,
                    webhookTriggered: webhookResult
                })
            };
        }

        return {
            statusCode: 200, 
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Success', store_id: inputStoreID })
        };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: error.message }) };
    }
};