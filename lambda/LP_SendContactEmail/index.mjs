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

  const { name, email, subject, message, website, targetEmail } = body;

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
  const toEmail = targetEmail || process.env.SES_TO_EMAIL;

  if (!fromEmail || !toEmail) {
    console.error("[ERROR] SES_FROM_EMAIL or SES_TO_EMAIL is not set");
    return corsResponse(500, { error: "Server configuration error" });
  }

  const emailSubject = `🎉 新しいお問い合わせが届きました！ [${name}]様より`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #0d9488; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">🎉 新しいお問い合わせが届きました！</h1>
      </div>
      
      <div style="border: 1px solid #ddd; border-top: none; padding: 30px; border-radius: 0 0 8px 8px; background-color: #fafafa;">
        <p>ご担当者様</p>
        <p>おめでとうございます！<br>Webサイトから新しいお問い合わせが届きました。</p>
        
        <div style="background-color: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="font-size: 16px; margin-top: 0; color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">📝 お客様からのメッセージ</h2>
          
          <p><strong>👤 お名前:</strong><br>${name} 様</p>
          <p><strong>✉️ メール:</strong><br>${email}</p>
          <p><strong>🏷️ 件名:</strong><br>${subject || "（未入力）"}</p>
          <p><strong>💬 内容:</strong><br>${message.replace(/\\n/g, '<br>')}</p>
        </div>

        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #854d0e;">
            <strong>💡 Landyからのヒント</strong><br>
            お問い合わせから「24時間以内」に返信すると成約率が劇的に上がります！すぐにお客様へお返事しましょう。
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>あなたのWebサイトは24時間休まず働いています✨<br>Powered by Landy</p>
      </div>
    </div>
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
          Html: {
            Data: emailHtml,
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
