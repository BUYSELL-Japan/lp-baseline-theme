import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "ap-southeast-2" }));

// Landy公式LP宛て（および店舗が特定できない場合）の送信先
const LANDY_CONTACT_EMAIL = process.env.LANDY_CONTACT_EMAIL || "hello@neural-seeds.com";
const STORE_DOMAIN_SUFFIX = ".global-reaches.com";
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export const handler = async (event) => {
  console.log("--- LAMBDA START (Resend version) ---");

  // CORSプリフライト対応
  if (event.httpMethod === "OPTIONS" || (event.requestContext && event.requestContext.http && event.requestContext.http.method === "OPTIONS")) {
    return corsResponse(200, { message: "OK" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return corsResponse(400, { error: "Invalid JSON body" });
  }

  // ※ body.targetEmail は受け取らない（任意の宛先に送信できてしまうため）
  const { name, email, subject, message, website } = body;

  // スパム対策（ハニーポット）
  if (website && String(website).trim().length > 0) {
    return corsResponse(200, { message: "Sent successfully" });
  }

  if (!name || !email || !message || !EMAIL_PATTERN.test(String(email))) {
    return corsResponse(400, { error: "Invalid input" });
  }

  // 送信先・送信元の設定
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = await resolveRecipient(event);

  if (!fromEmail || !toEmail) {
    console.error("Missing config: FROM or TO email");
    return corsResponse(500, { error: "Configuration error" });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const emailSubject = `🎉 新しいお問い合わせが届きました！ [${String(name).replace(/[\r\n]/g, ' ')}]様より`;
  
  // HTMLテンプレート
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
          
          <p><strong>👤 お名前:</strong><br>${safeName} 様</p>
          <p><strong>✉️ メール:</strong><br>${safeEmail}</p>
          <p><strong>🏷️ 件名:</strong><br>${safeSubject || "（未入力）"}</p>
          <p><strong>💬 内容:</strong><br>${safeMessage}</p>
        </div>

        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #854d0e;">
            <strong>💡 Landyからのヒント</strong><br>
            お問い合わせから「24時間以内」に返信すると成約率が劇的に上がります！すぐにお客様へお返事しましょう。
          </p>
          <div style="text-align: center;">
            <a href="mailto:${safeEmail}" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px;">
              ✉️ このお客様に返信する
            </a>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>あなたのWebサイトは24時間休まず働いています✨<br>Powered by Landy</p>
      </div>
    </div>
  `;

  try {
    // Resend APIを直接叩く（ライブラリ不要）
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Landy Support <${fromEmail}>`,
        to: [toEmail],
        reply_to: email, // お客さんのメアドを返信先に設定
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    console.log("[SUCCESS] Email sent via Resend:", result.id);
    return corsResponse(200, { message: "Sent successfully" });

  } catch (error) {
    console.error("[ERROR] Resend failed:", error);
    return corsResponse(500, { error: error.message });
  }
};

/**
 * 送信先をサーバー側で決定する。
 * - 店舗LP（<subdomain>.global-reaches.com）からの送信 → Stores テーブルの contact_email
 * - それ以外（Landy公式LPなど）、または店舗が特定できない場合 → LANDY_CONTACT_EMAIL
 * Origin を偽装されても、送信先は登録済み店舗か Landy 宛てに限られる。
 */
async function resolveRecipient(event) {
  const headers = event.headers || {};
  const originHeader = headers.origin || headers.Origin || headers.referer || headers.Referer || "";

  let hostname = "";
  try {
    hostname = new URL(originHeader).hostname.toLowerCase();
  } catch {
    return LANDY_CONTACT_EMAIL;
  }

  if (!hostname.endsWith(STORE_DOMAIN_SUFFIX)) {
    return LANDY_CONTACT_EMAIL;
  }

  const subdomain = hostname.slice(0, -STORE_DOMAIN_SUFFIX.length);
  if (!subdomain || subdomain.includes(".")) {
    return LANDY_CONTACT_EMAIL;
  }

  try {
    let lastKey;
    do {
      const result = await ddb.send(new ScanCommand({
        TableName: process.env.STORES_TABLE_NAME || "Stores",
        ProjectionExpression: "contact_email",
        FilterExpression: "Subdomain = :sub OR subdomain = :sub",
        ExpressionAttributeValues: { ":sub": subdomain },
        ExclusiveStartKey: lastKey,
      }));
      const store = (result.Items || []).find(item => item.contact_email);
      if (store) return store.contact_email;
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);
  } catch (err) {
    console.error("Failed to look up store contact_email:", err);
  }

  console.warn(`No contact_email for subdomain "${subdomain}". Falling back to LANDY_CONTACT_EMAIL.`);
  return LANDY_CONTACT_EMAIL;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function corsResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}
