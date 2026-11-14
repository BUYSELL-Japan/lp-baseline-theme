import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { authorizeStoreAccess, getBearerToken } from "./cognitoAuth.mjs";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || "ap-southeast-2" }));

// AUTH_MODE=migration の間はトークンなしのリクエストも通す（警告ログのみ）。それ以外はトークン必須
const AUTH_MODE = process.env.AUTH_MODE === "migration" ? "migration" : "enforce";

// 1回の翻訳で受け付ける入力の上限（JSON文字列の長さ）。admin-ui はセクション・アイテム単位で送ってくる
const MAX_INPUT_CHARS = 20000;

// UI の定型文。AI に訳させず、この訳で固定する（値が完全に一致したときだけ）
const UI_FIXED_TERMS = {
    "コース・プラン": { "en": "Course / Plan", "zh-tw": "套餐方案", "ko": "코스 플랜" },
    "アクセス": { "en": "Access", "zh-tw": "交通方式", "ko": "오시는 길" },
    "店舗情報": { "en": "Store Info", "zh-tw": "店鋪資訊", "ko": "매장 정보" },
    "運営会社": { "en": "Company", "zh-tw": "營運公司", "ko": "운영사" },
    "運営会社情報": { "en": "Company Info", "zh-tw": "營運公司資訊", "ko": "운영사 정보" },
    "メニュー": { "en": "Menu", "zh-tw": "菜單", "ko": "메뉴" },
};

// 料理名などの用語集。文中に出てきたときもこの訳を使うようプロンプトで指示し、
// 値がこの語と完全に一致したときは AI の結果に関係なくこの訳で固定する
const GLOSSARY = {
    "沖縄そば": { "en": "Okinawa Soba", "zh-tw": "沖繩蕎麥麵", "ko": "오키나와 소바" },
    "ゴーヤチャンプルー": { "en": "Goya Champuru (Bitter Melon Stir-fry)", "zh-tw": "苦瓜炒豆腐", "ko": "고야 참푸루" },
    "ラフテー": { "en": "Rafute (Braised Pork Belly)", "zh-tw": "沖繩紅燒豬肉", "ko": "라후테" },
    "御膳": { "en": "Set Meal", "zh-tw": "套餐", "ko": "정식" },
    "八寸": { "en": "Hassun (Appetizer Assortment)", "zh-tw": "八寸前菜", "ko": "핫순" },
    "和牛": { "en": "Wagyu Beef", "zh-tw": "和牛", "ko": "와규" },
    "土鍋ごはん": { "en": "Donabe Rice", "zh-tw": "土鍋飯", "ko": "돌솥밥" },
    "沖縄ぜんざい": { "en": "Okinawa Zenzai (Sweet Red Bean Dessert)", "zh-tw": "沖繩紅豆湯", "ko": "오키나와 젠자이" },
};

const FIXED_TERMS = { ...GLOSSARY, ...UI_FIXED_TERMS };

function fixedTranslation(text) {
    if (typeof text !== "string") return null;
    const fixed = FIXED_TERMS[text.trim()];
    return fixed ? { ja: text, ...fixed } : null;
}

// 入力のうち辞書と完全一致する文字列を、先に多言語オブジェクトへ置き換える（AI に訳させない）
function applyFixedToInput(node) {
    if (typeof node === "string") return fixedTranslation(node) ?? node;
    if (Array.isArray(node)) return node.map(applyFixedToInput);
    if (node && typeof node === "object") {
        return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, applyFixedToInput(v)]));
    }
    return node;
}

// AI の出力でも、日本語が辞書と完全一致する多言語オブジェクトは辞書の訳で上書きする（念のための保証）
function applyFixedToOutput(node) {
    if (Array.isArray(node)) return node.map(applyFixedToOutput);
    if (node && typeof node === "object") {
        const fixed = fixedTranslation(node.ja);
        if (fixed) return { ...node, ...fixed };
        return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, applyFixedToOutput(v)]));
    }
    return node;
}

const glossaryLine = ([ja, t]) => `   - ${ja} → en: "${t.en}" / zh-tw: "${t["zh-tw"]}" / ko: "${t.ko}"`;
const GLOSSARY_LINES = Object.entries(GLOSSARY).map(glossaryLine).join("\n");

// 入力に実際に出てくる用語だけを、文中でも置き換えるよう念押しする（文中の用語が無視されやすいため）
function glossaryReminder(contentData) {
    const text = JSON.stringify(contentData);
    const found = Object.entries(GLOSSARY).filter(([ja]) => text.includes(ja));
    if (found.length === 0) return "";
    return `IMPORTANT: This input contains the following glossary terms. Every time they appear, including in the middle of a sentence, write exactly the glossary translation in each language (never a transliteration or another word):
${found.map(glossaryLine).join("\n")}
`;
}

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

        // Cognito IDトークンを検証し、この店舗の所有者か確認する
        const storeId = body.storeId;
        if (AUTH_MODE === "migration" && !getBearerToken(event.headers || {})) {
            console.warn(`[AUTH_MIGRATION] translate without token (storeId: ${storeId})`);
        } else {
            const auth = await authorizeStoreAccess(event, storeId, ddb);
            if (!auth.ok) {
                return { statusCode: auth.statusCode, headers: CORS_HEADERS, body: JSON.stringify({ message: auth.message }) };
            }
        }

        const inputLength = JSON.stringify(contentData).length;
        if (inputLength > MAX_INPUT_CHARS) {
            return { statusCode: 413, headers: CORS_HEADERS, body: JSON.stringify({ message: `Content too large (${inputLength} > ${MAX_INPUT_CHARS} chars).` }) };
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
7. FIXED TRANSLATIONS: Some values in the input are already objects with "ja", "en", "zh-tw" and "ko" keys. These are fixed dictionary translations. Copy them to the output exactly as they are. Do NOT change them.
8. GLOSSARY: Whenever the Japanese text contains one of the following terms (also inside longer sentences), you MUST use exactly these translations:
${GLOSSARY_LINES}
9. CHINESE: "zh-tw" MUST be Traditional Chinese as used in Taiwan, with Taiwanese vocabulary. Simplified Chinese characters and mainland Chinese expressions are forbidden (e.g. use 資訊 not 信息, 影片 not 視頻, 品質 not 質量).
10. PROPER NOUNS: In English ("en"), write store names, person names and other Japanese proper nouns in Latin letters that follow the Japanese reading faithfully (e.g. 一徹 = ITTETSU, 花子 = HANAKO). Do NOT translate their meaning. In "zh-tw", keep proper nouns written in kanji as they are. In "ko", write proper nouns in Hangul following the Japanese reading, never in Latin letters (e.g. 一徹 = 잇테쓰, 花子 = 하나코).
11. NUMBERS: Numbers, prices and numbers of people MUST be exactly the same as in the original. Do NOT change, round, convert or omit them.

${glossaryReminder(contentData)}
Input JSON:
${JSON.stringify(applyFixedToInput(contentData))}`;

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
        const translatedItem = applyFixedToOutput(JSON.parse(gptData.choices[0].message.content));

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
