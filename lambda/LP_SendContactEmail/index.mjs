export const handler = async (event) => {
  console.log("--- LAMBDA START (Resend version) ---");

  // CORS繝励Μ繝輔Λ繧､繝亥ｯｾ蠢・  if (event.httpMethod === "OPTIONS") {
    return corsResponse(200, { message: "OK" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return corsResponse(400, { error: "Invalid JSON body" });
  }

  const { name, email, subject, message, website, targetEmail } = body;

  // 繧ｹ繝代Β蟇ｾ遲厄ｼ医ワ繝九・繝昴ャ繝茨ｼ・  if (website && website.trim().length > 0) {
    return corsResponse(200, { message: "Sent successfully" });
  }

  // 騾∽ｿ｡蜈医・騾∽ｿ｡蜈・・險ｭ螳・  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = targetEmail || process.env.SES_TO_EMAIL; // 蠎苓・縺ｮ繝｡繧｢繝・
  if (!fromEmail || !toEmail) {
    console.error("Missing config: FROM or TO email");
    return corsResponse(500, { error: "Configuration error" });
  }

  const emailSubject = `脂 譁ｰ縺励＞縺雁撫縺・粋繧上○縺悟ｱ翫″縺ｾ縺励◆・・[${name}]讒倥ｈ繧柿;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #0d9488; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">脂 譁ｰ縺励＞縺雁撫縺・粋繧上○縺悟ｱ翫″縺ｾ縺励◆・・/h1>
      </div>
      
      <div style="border: 1px solid #ddd; border-top: none; padding: 30px; border-radius: 0 0 8px 8px; background-color: #fafafa;">
        <p>縺疲球蠖楢・ｧ・/p>
        <p>縺翫ａ縺ｧ縺ｨ縺・＃縺悶＞縺ｾ縺呻ｼ・br>Web繧ｵ繧､繝医°繧画眠縺励＞縺雁撫縺・粋繧上○縺悟ｱ翫″縺ｾ縺励◆縲・/p>
        
        <div style="background-color: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="font-size: 16px; margin-top: 0; color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">統 縺雁ｮ｢讒倥°繧峨・繝｡繝・そ繝ｼ繧ｸ</h2>
          
          <p><strong>側 縺雁錐蜑・</strong><br>${name} 讒・/p>
          <p><strong>笨会ｸ・繝｡繝ｼ繝ｫ:</strong><br>${email}</p>
          <p><strong>捷・・莉ｶ蜷・</strong><br>${subject || "・域悴蜈･蜉幢ｼ・}</p>
          <p><strong>町 蜀・ｮｹ:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        </div>

        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #854d0e;">
            <strong>庁 Landy縺九ｉ縺ｮ繝偵Φ繝・/strong><br>
            縺雁撫縺・粋繧上○縺九ｉ縲・4譎る俣莉･蜀・阪↓霑比ｿ｡縺吶ｋ縺ｨ謌千ｴ・紫縺悟括逧・↓荳翫′繧翫∪縺呻ｼ√☆縺舌↓縺雁ｮ｢讒倥∈縺願ｿ比ｺ九＠縺ｾ縺励ｇ縺・・          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>縺ゅ↑縺溘・Web繧ｵ繧､繝医・24譎る俣莨代∪縺壼ロ縺・※縺・∪縺吮惠<br>Powered by Landy</p>
      </div>
    </div>
  `;

  try {
    // Resend API繧堤峩謗･蜿ｩ縺擾ｼ医Λ繧､繝悶Λ繝ｪ荳崎ｦ・ｼ・    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Landy Support <${fromEmail}>`,
        to: [toEmail],
        reply_to: email, // 縺雁ｮ｢縺輔ｓ縺ｮ繝｡繧｢繝峨ｒ霑比ｿ｡蜈医↓險ｭ螳・        subject: emailSubject,
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
