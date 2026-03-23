/**
 * LP_SendContactEmail - AWS Lambda関数（Node.js 18.x / 20.x）
 *
 * 【概要】
 * お問い合わせフォームからのPOSTリクエストを受け取り、スパムを判定した上で
 * Amazon SES（Simple Email Service）を使ってメールを送信します。
 *
 * 【デプロイ前の準備（AWSコンソール側）】
 * 1. Amazon SESでメール送信元アドレス（例: no-reply@あなたのドメイン.com）を検証（Verified）する
 * 2. 受信先メールアドレスも検証しておく（サンドボックス解除前は両方検証が必要）
 * 3. このLambdaに「AmazonSESFullAccess」または「ses:SendEmail」権限を持つIAMロールを付与する
 * 4. API Gatewayで「HTTP API」か「REST API」を作成し、POSTメソッドをこのLambdaに紐付ける
 * 5. CORS設定でLPのドメイン（例: https://toamenya.global-reaches.com）を許可する
 *
 * 【環境変数（Lambda→設定→環境変数で設定してください）】
 * - SES_FROM_EMAIL : 送信元アドレス（SESで検証済のアドレス）
 * - SES_TO_EMAIL   : 受信先アドレス（お知らせを受け取りたいアドレス）
 * - SES_REGION     : SESを使うAWSリージョン（例: ap-northeast-1）
 *                    ※ Lambdaのリージョンと同じで問題ありません
 */

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.SES_REGION || "ap-northeast-1" });

// ===================================================
// スパム判定ロジック
// ===================================================

/**
 * ハニーポットチェック：隠しフィールド（website）に値が入っていたらボット
 */
function isHoneypotTriggered(website) {
  return typeof website === "string" && website.trim().length > 0;
}

/**
 * URL過多チェック：本文に"http"が2回以上含まれていたらスパム
 */
function hasTooManyUrls(message) {
  if (!message) return false;
  const matches = String(message).match(/https?:\/\//gi);
  return matches !== null && matches.length >= 2;
}

// ===================================================
// メイン処理
// ===================================================

export const handler = async (event) => {
  // CORSプリフライトリクエスト（OPTIONSメソッド）への対応
  if (event.requestContext?.http?.method === "OPTIONS") {
    return corsResponse(200, { message: "OK" });
  }

  // リクエストボディのパース
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return corsResponse(400, { error: "Invalid JSON body" });
  }

  const { name, email, subject, message, website } = body;

  // --- スパム判定 ---

  // ハニーポットチェック
  if (isHoneypotTriggered(website)) {
    console.log("[SPAM] Honeypot triggered:", { website });
    // ボットには「成功したフリ」をして静かに終了する（エラーを返さない）
    return corsResponse(200, { message: "Sent successfully" });
  }

  // URL過多チェック
  if (hasTooManyUrls(message)) {
    console.log("[SPAM] Too many URLs in message");
    return corsResponse(200, { message: "Sent successfully" });
  }

  // 必須項目チェック
  if (!name || !email || !message) {
    return corsResponse(400, { error: "Missing required fields" });
  }

  // --- メール送信 ---
  const fromEmail = process.env.SES_FROM_EMAIL;
  const toEmail = process.env.SES_TO_EMAIL;

  if (!fromEmail || !toEmail) {
    console.error("[ERROR] SES_FROM_EMAIL or SES_TO_EMAIL is not set");
    return corsResponse(500, { error: "Server configuration error" });
  }

  const emailSubject = subject
    ? `【LPお問い合わせ】${subject}`
    : `【LPお問い合わせ】${name}様よりご連絡`;

  const emailBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LP お問い合わせフォームからの送信
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【お名前】
${name}

【メールアドレス】
${email}

【件名】
${subject || "（未入力）"}

【メッセージ】
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールはLPのお問い合わせフォームから自動送信されました。
  `.trim();

  try {
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [toEmail],
      },
      ReplyToAddresses: [email], // 返信ボタンを押すと自動的にユーザーに返信される
      Message: {
        Subject: {
          Data: emailSubject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    await ses.send(command);
    console.log("[SUCCESS] Email sent:", { name, email, subject });
    return corsResponse(200, { message: "Sent successfully" });

  } catch (error) {
    console.error("[ERROR] SES send failed:", error);
    return corsResponse(500, { error: "Failed to send email" });
  }
};

// ===================================================
// CORSヘッダー付きレスポンスのヘルパー関数
// ===================================================
function corsResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      // ★ 本番環境では、ここをLPのドメインに書き換えてください
      // 例: "Access-Control-Allow-Origin": "https://toamenya.global-reaches.com"
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}
