import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { authorizeStoreAccess } from "./cognitoAuth.mjs";

// GET /lp/get-content/{storeId}: 管理画面用（Cognito認証必須・下書きも返す）
// GET /lp/content/{storeId}    : 公開サイトのビルド用（認証不要・Published のみ返す）
const ADMIN_RESOURCE = '/lp/get-content/{storeId}';

const TABLE_NAME = process.env.TABLE_NAME || 'LP_Contents'; 
const REGION = process.env.AWS_REGION || 'ap-southeast-2';
const GSI_NAME = 'Subdomain-index'; 

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => { 
    // --- 1. 動的な CORS 設定 ---
    const origin = event.headers?.origin || event.headers?.Origin || '';
    
    let allowOrigin = 'https://admin-lp.global-reaches.com'; 
    if (origin.endsWith('.global-reaches.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        allowOrigin = origin;
    }

    const CORS_HEADERS = {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    // パスパラメータから ID (store_id または Subdomainスラグ) を取得
    const slug = event.pathParameters ? event.pathParameters.storeId : null;
    
    if (!slug) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Missing ID in request path.' }),
        };
    }

    const isAdminRequest = event.resource === ADMIN_RESOURCE;

    try {
        if (isAdminRequest) {
            const auth = await authorizeStoreAccess(event, slug, ddb);
            if (!auth.ok) {
                return {
                    statusCode: auth.statusCode,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ message: auth.message }),
                };
            }
        }

        // --- 2. store_id で直接取得 ---
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                'store_id': slug,
                'RecordType': 'LP_CONTENT'
            }
        };
        const getResponse = await ddb.send(new GetCommand(getParams));

        // 公開用パスでは Published 以外（下書き）を返さない
        if (getResponse.Item && (isAdminRequest || getResponse.Item.Status === 'Published')) {
            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify(getResponse.Item)
            };
        }

        // ★修正ポイント: 管理画面（Admin）からのリクエストの場合、
        // store_idでの検索に失敗した時点ですぐに404を返す（他店舗の誤検知を防ぐため）
        if (isAdminRequest) {
            return {
                statusCode: 404,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: 'Content not found. Serving default sample data.' }),
            };
        }

        // --- 3. 閲覧/プレビュー用 (Subdomain GSI で検索) ---
        // ※ここは公開サイト（Admin以外）からのアクセスの時だけ実行される
        const queryParams = {
            TableName: TABLE_NAME,
            IndexName: GSI_NAME,
            KeyConditionExpression: 'Subdomain = :slug', 
            FilterExpression: 'RecordType = :rtype AND #s = :published',
            ExpressionAttributeValues: { ':slug': slug, ':rtype': 'LP_CONTENT', ':published': 'Published' },
            ProjectionExpression: 'ContentData, #s, UpdatedAt, store_id, Subdomain',
            ExpressionAttributeNames: { '#s': 'Status' }
        };
        const queryResponse = await ddb.send(new QueryCommand(queryParams));
        
        if (queryResponse.Items && queryResponse.Items.length > 0) {
            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify(queryResponse.Items[0])
            };
        }

        return {
            statusCode: 404,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Content not found.' }),
        };

    } catch (error) {
        console.error("Lambda Error:", error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
