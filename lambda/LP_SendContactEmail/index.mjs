export const handler = async (event) => {
  console.log("--- LAMBDA START (Resend version) ---");

  // CORSプリフライト対応
  if (event.httpMethod === "OPTIONS") {
    return corsResponse(200, { message: "OK" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return corsResponse(400, { error: "Invalid JSON body" });
  }

  const { name, email, subject, message, website, targetEmail } = body;

  // スパム対策（ハニーポット）
  if (website && website.trim().length > 0) {
    return corsResponse(200, { message: "Sent successfully" });
  }

  // 送信先・送信元の設定
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = targetEmail || process.env.SES_TO_EMAIL; // 店舗のメアド

  if (!fromEmail || !toEmail) {
    console.error("Missing config: FROM or TO email");
    return corsResponse(500, { error: "Configuration error" });
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