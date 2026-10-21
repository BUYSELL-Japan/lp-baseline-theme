import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "ap-southeast-2" });
const BUCKET_NAME = "lp-store-images";
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || "d1bgs7tj36vb93.cloudfront.net";

export const handler = async (event) => {
    const responseHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
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

        const { storeId, fileName, contentType } = body;
        if (!storeId || storeId === 'default-store' || storeId === 'undefined') {
            return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ message: "Valid storeId is required." }) };
        }

        // S3の物理的な保存場所
        const key = `stores/${storeId}/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType || "image/jpeg",
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
