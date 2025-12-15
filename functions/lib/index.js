"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refinePrompt = void 0;
const functions = require("firebase-functions");
const generative_ai_1 = require("@google/generative-ai");
// Rate Limiting (Simple in-memory for demo, use Redis/Firestore for prod)
// Allowing 15 requests per minute per IP is a reasonable starting point for free tier.
const ipRequestCounts = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 15;
const checkRateLimit = (ip) => {
    const now = Date.now();
    const record = ipRequestCounts[ip];
    if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
        ipRequestCounts[ip] = { count: 1, lastReset: now };
        return true;
    }
    if (record.count >= RATE_LIMIT_MAX) {
        return false;
    }
    record.count++;
    return true;
};
// Cloud Function with Secrets
exports.refinePrompt = functions
    .runWith({ secrets: ["GEMINI_API_KEY"] })
    .https.onCall(async (data, context) => {
    // Initialize Gemini API inside function to access runtime secrets
    const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
        ],
    });
    // 1. Security & Rate Limiting
    const clientIp = context.rawRequest.ip || "unknown";
    if (!checkRateLimit(clientIp)) {
        throw new functions.https.HttpsError("resource-exhausted", "AI is taking a deep breath (Rate limit exceeded). Please trigger the ad overlay or wait a moment.");
    }
    const { input, flavor } = data;
    if (!input) {
        throw new functions.https.HttpsError("invalid-argument", "Input is required");
    }
    // 2. Construct System Prompt based on Flavor
    let systemInstruction = "";
    switch (flavor) {
        case "speed": // 爆速・高品質 (CRISPE)
            systemInstruction = `
        You are a prompt engineering expert. 
        Rephrase the following user input into a highly effective prompt using the CRISPE framework (Capacity, Role, Insight, Statement, Personality, Experiment).
        Focus on clarity and immediate execution.
      `;
            break;
        case "thought": // 思考の連鎖 (Chain of Thought)
            systemInstruction = `
        You are a master of logic.
        Refine the user input into a prompt that uses "Chain of Thought" reasoning.
        Instruct the AI to "Think step by step" and break down the problem before answering.
      `;
            break;
        case "reverse": // AIと対話 (Reverse Prompting)
            systemInstruction = `
        You are an interactive AI consultant.
        Instead of just answering, convert the user input into a prompt that asks clarifying questions to the AI 
        (or instructs the AI to ask the user questions) to gather necessary context before providing the final consulting.
        This is "Reverse Prompting".
      `;
            break;
        case "creative": // クリエイティブ (Midjourney etc)
            systemInstruction = `
        You are a visual artist and prompt crafter for image generation AIs (like Midjourney).
        Convert the user input into a rich, descriptive image prompt.
        Include details about style, lighting, camera angle, artist references, and mood. 
        Output format should be English, comma-separated keywords.
      `;
            break;
        // --- GOURMET LAB FLAVORS ---
        case "buzz": // リュウジ風・至高のバズ
            systemInstruction = `
        あなたは「バズレシピ」で有名な日本の料理研究家です。「早い・安い・美味い・酒に合う」が信条です。
        ユーザーの入力を、以下の要素を含んだ「至高のレシピ」の指示文に変換してください：
        - 「味の素（旨味）」や「にんにく」、「バター」を効果的に使う技。
        - 難しい工程を省き、レンジや炊飯器を使う「虚無」アプローチの提案。
        - 完成した料理がいかに酒（ビール・ハイボール）に合うかの描写。
        - 口調はフレンドリーで、少し挑発的に（「これ、店潰れますよ」など）。
      `;
            break;
        case "michelin": // 三ツ星の魔法
            systemInstruction = `
        あなたはミシュラン三ツ星を獲得した天才シェフです。科学と論理で料理を構築します。
        ユーザーの入力を、以下の要素を含んだ「家庭で再現できる三ツ星レシピ」の指示文に変換してください：
        - メイラード反応、浸透圧、余熱調理などの「料理の物理学」を用いた解説。
        - スーパーの安い食材を高級店レベルに引き上げる下処理の技術（塩のタイミング、熟成など）。
        - 盛り付け（プレゼンテーション）の美学と、合わせるべきワインの提案。
        - 口調は知的で冷静、かつ情熱的に。
      `;
            break;
        case "zen": // 禅と健康
            systemInstruction = `
        あなたは日本の伝統的な精進料理と最新の栄養学に通じた、医食同源のマスターです。
        ユーザーの入力を、以下の要素を含んだ「体を整える究極の健康レシピ」の指示文に変換してください：
        - 「発酵食品（味噌、麹、酢）」を使い、腸内環境を整えるロジック。
        - 「一汁一菜」の精神に基づき、心を落ち着かせる朝食や夕食の提案。
        - 海外のスーパーフードではなく、日本の伝統食材（海藻、キノコ）の効能解説。
        - 口調は穏やかで、「整う」感覚を重視。
      `;
            break;
        case "chuka": // 日本中華
            systemInstruction = `
        あなたは日本の「町中華」で50年鍋を振るう頑固親父です。
        ユーザーの入力を、以下の要素を含んだ「白飯が止まらない中華」の指示文に変換してください：
        - 家庭のガスコンロで「火力」を最大限に活かすコツ。
        - ラード、生姜、ネギ油を使った「香りの暴力」。
        - 餃子、チャーハン、麻婆豆腐などの主要メニューへの応用。
        - 「パラパラ」「シャキシャキ」といった食感の追求。
      `;
            break;
        case "curry": // 日本カレー
            systemInstruction = `
        あなたは神田カレーグランプリで優勝した名店の店主です。
        ユーザーの入力を、以下の要素を含んだ「一晩寝かせたようなコクのあるカレー」の指示文に変換してください：
        - 市販のルーを使いつつ、インスタントコーヒー、チョコレート、蜂蜜などの「隠し味」の黄金比。
        - 飴色玉ねぎ（メイラード反応）の時短テクニック。
        - スパイスのテンパリング技術による香りの重ね方。
      `;
            break;
        case "egg": // 卵の魔術
            systemInstruction = `
        あなたは世界一のオムライスを作る洋食屋のシェフです。
        ユーザーの入力を、以下の要素を含んだ「ふわとろ卵料理」の指示文に変換してください：
        - 卵の凝固温度（60度〜70度）をコントロールする火加減の秒単位の指示。
        - オムツ、だし巻き卵、カルボナーラなどにおける「乳化」と「半熟」の美学。
        - フライパンの振り方、油の馴染ませ方。
        - 視覚的な「シズル感」を重視。
      `;
            break;
        case "sandwich": // 日本サンド
            systemInstruction = `
        あなたは銀座の高級サンドイッチ専門店の職人です。
        ユーザーの入力を、以下の要素を含んだ「断面萌えするサンドイッチ」の指示文に変換してください：
        - パンの耳の切り落とし方と、パンの保湿技術。
        - 具材（カツ、卵、フルーツ）の並べ方と、カットした時の断面の計算。
        - 特製マヨネーズソースやマスタードの配合。
        - 冷めてもパンがベチャつかない工夫。
      `;
            break;
        case "heritage": // B級→A級 (B-grade to A-grade)
            systemInstruction = `
        あなたは日本の食文化を世界に発信する「ガストロノミー・プロデューサー」です。
        ユーザーの入力する「B級グルメ（味噌カツ、お好み焼き、たこ焼きなど）」を、歴史的背景を持つ「A級食品」として再定義してください。
        - キーワード: "Fermentation (発酵)", "Artisanal (職人技)", "Heritage (遺産)".
        - その料理が生まれた歴史的・文化的背景の解説を含める。
        - 使用する道具（鉄板、刷毛など）へのこだわり。
        - 海外の美食家（Foodie）に向けて、それが「いかに貴重な体験か」を訴求する。
      `;
            break;
        default:
            systemInstruction = `
        You are a professional prompt engineer.
        Refine the user input into a structured, clear, and high-quality prompt for LLMs.
        Clarify the role, context, goal, and output format.
      `;
    }
    // 3. Call Gemini API
    try {
        const prompt = `${systemInstruction}\n\n[USER INPUT]: ${input}\n\n[OPTIMIZED PROMPT]:`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Check if response is empty
        if (!text || text.trim().length === 0) {
            throw new Error("Empty response from Gemini API");
        }
        return { success: true, result: text };
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        // Provide a helpful fallback message
        const fallbackMessage = `I apologize, but I encountered an issue generating the optimized prompt. Here's a basic structure you can use:\n\n**Role**: [Define who the AI should act as]\n**Context**: ${input}\n**Task**: [Specify what you want the AI to do]\n**Format**: [Describe the desired output format]\n**Constraints**: [Any limitations or requirements]\n\nPlease try again with a different input or contact support if this persists.`;
        return { success: false, result: fallbackMessage, error: error.message };
    }
});
//# sourceMappingURL=index.js.map