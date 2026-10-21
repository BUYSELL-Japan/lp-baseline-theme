export const handler = async (event) => {
    const CORS_HEADERS = {
        'Access-Control-Allow-Origin': 'https://admin-lp.global-reaches.com',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };

    try {
        const body = JSON.parse(event.body || "{}");
        
        // Boltの新しい設計に合わせ、contentDataを柔軟に取得
        // 1アイテムずつの翻訳（plan-0等）が来ることを想定
        const contentData = body.contentData || body.content || body;
        const targetLanguages = body.targetLanguages || ["en", "zh-tw", "ko"];
        const apiKey = process.env.OPENAI_API_KEY;

        if (!contentData || Object.keys(contentData).length === 0) {
            throw new Error("Empty content.");
        }

        // プロンプト：Bolt側の「アイテム単位マージ」と「確実な翻訳」を成功させるための厳格なルール
        const prompt = `Task: Translate the Japanese text inside the following JSON object into the specified target languages.
Target Languages: ja (original), ${targetLanguages.join(", ")}

CRITICAL RULES:
1. You MUST actually TRANSLATE the Japanese text into the target languages. Do NOT copy the Japanese text into the "en", "zh-tw", or "ko" fields.
2. For every string value containing human-readable text (Japanese), convert it into this exact object format:
   {
     "ja": "元の日本語テキスト (Original Japanese)",
     "en": "English translation here",
     "zh-tw": "Traditional Chinese translation here",
     "ko": "Korean translation here"
   }
3. If a key ends with "_ja" (e.g., "title_ja"), convert it to a clean key (e.g., "title") with the multilingual object.
4. EXCLUDE: Do NOT translate or change keys for:
   - Image URLs (ending in .jpg, .png, etc.)
   - Colors (hex codes like #ffffff)
   - IDs or non-textual slugs
   - Purely numerical values
   Leave them as plain strings.
5. Structure: Maintain the exact same flat or nested structure provided in the input.
6. Output ONLY the resulting valid JSON object.

Input JSON:
${JSON.stringify(contentData)}`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // コストと速度のバランスが良い
                messages: [
                    { 
                        role: "system", 
                        content: "You are a translation engine that outputs ONLY valid JSON objects where text values are transformed into multilingual objects (ja, en, zh-tw, ko)." 
                    },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0
            })
        });

        // 🟢 修正：エラー時にもクラッシュしないように一旦テキストとして取得
        const responseText = await response.text();
        
        let gptData;
        try {
            gptData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse OpenAI response as JSON. Raw text:", responseText);
            throw new Error(`OpenAI API returned non-JSON response: ${responseText.substring(0, 100)}...`);
        }

        if (!response.ok) {
            console.error("OpenAI API Error:", gptData);
            throw new Error(gptData.error?.message || "OpenAI API Error");
        }

        // 翻訳結果をパース
        const translatedItem = JSON.parse(gptData.choices[0].message.content);

        // ✅ 修正箇所：success と translatedData ラッパーを削除
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(translatedItem)  // シンプルに翻訳データのみ返す
        };

    } catch (error) {
        console.error("Lambda Error:", error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ 
                message: "Translation failed", 
                error: error.message
            })
        };
    }
};
