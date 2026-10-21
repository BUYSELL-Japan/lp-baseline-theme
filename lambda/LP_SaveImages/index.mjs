import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { authorizeStoreAccess, getBearerToken } from "./cognitoAuth.mjs";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "ap-southeast-2" });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || "ap-southeast-2" }));
const BUCKET_NAME = "lp-store-images";
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || "d1bgs7tj36vb93.cloudfront.net";

// AUTH_MODE=migration の間はトークンなしのリクエストも通す（警告ログのみ）。それ以外はトークン必須
const AUTH_MODE = process.env.AUTH_MODE === "migration" ? "migration" : "enforce";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const handler = async (event) => {
    const responseHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
    };

    try {
        let body;
        if (typeof event.body === 'string') {
            try {
                body = JSON.parse(event.body);
            } catch (e) {
                return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ message: "Invalid JSON format" }) };
            }
        } else {
            body = event.body;
        }

        const { storeId, fileName, contentType } = body || {};
        if (!storeId || storeId === 'default-store' || storeId === 'undefined' || !/^[A-Za-z0-9_-]+$/.test(storeId)) {
            return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ message: "Valid storeId is required." }) };
        }

        // Cognito IDトークンを検証し、この店舗の所有者か確認する
        if (AUTH_MODE === "migration" && !getBearerToken(event.headers || {})) {
            console.warn(`[AUTH_MIGRATION] upload-url without token (storeId: ${storeId})`);
        } else {
            const auth = await authorizeStoreAccess(event, storeId, ddb);
            if (!auth.ok) {
                return { statusCode: auth.statusCode, headers: responseHeaders, body: JSON.stringify({ message: auth.message }) };
            }
        }

        const finalContentType = contentType || "image/jpeg";
        if (!ALLOWED_CONTENT_TYPES.includes(finalContentType)) {
            return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ message: `contentType must be one of: ${ALLOWED_CONTENT_TYPES.join(", ")}` }) };
        }

        // パス区切りなどを除いたファイル名にする（他店舗のフォルダに書き込めないように）
        const safeFileName = String(fileName || "image").replace(/[^A-Za-z0-9._-]/g, "_").slice(-100);

        // S3の物理的な保存場所
        const key = `stores/${storeId}/${Date.now()}-${safeFileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: finalContentType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        // CloudFront経由の公開URLを生成
        // CloudFrontのOrigin Pathが /stores に設定されているため、stores/ を除外したパスにする
        const cloudfrontPath = key.replace('stores/', '');
        const s3Url = `https://${CLOUDFRONT_DOMAIN}/${cloudfrontPath}`;

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify({ uploadUrl, s3Url, key }),
        };

    } catch (error) {
        console.error("Error:", error);
        return { statusCode: 500, headers: responseHeaders, body: JSON.stringify({ message: "Internal Server Error" }) };
    }
};
