import * as functions from "firebase-functions";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Rate Limiting (Simple in-memory for demo, use Redis/Firestore for prod)
// Allowing 15 requests per minute per IP is a reasonable starting point for free tier.
const ipRequestCounts: { [ip: string]: { count: number; lastReset: number } } = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 15;

const checkRateLimit = (ip: string): boolean => {
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

// Cloud Function (emulator compatible)
export const refinePrompt = functions
    .https.onCall(async (data, context) => {

        // Initialize Gemini API inside function to access runtime secrets
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        // 1. Security & Rate Limiting
        const clientIp = context.rawRequest.ip || "unknown";
        if (!checkRateLimit(clientIp)) {
            throw new functions.https.HttpsError(
                "resource-exhausted",
                "AI is taking a deep breath (Rate limit exceeded). Please trigger the ad overlay or wait a moment."
            );
        }

        const { input, flavor } = data;
        if (!input) {
            throw new functions.https.HttpsError("invalid-argument", "Input is required");
        }

        // 2. Construct System Prompt based on Flavor
        let systemInstruction = "";

        switch (flavor) {
            case "speed": // 爆速・高品質
                systemInstruction = `
        You are a highly efficient, capable AI assistant.
        Provide a direct, high-quality answer to the user's request.
        Focus on clarity, brevity, and immediate value. Do not fluff.
      `;
                break;
            case "thought": // 思考の連鎖
                systemInstruction = `
        You are a master of logic and reasoning.
        Solve the user's problem or answer their question using "Chain of Thought" reasoning.
        Show your thinking process step-by-step. Break down complex problems into manageable parts.
      `;
                break;
            case "reverse": // AIと対話 (Consultant mode)
                systemInstruction = `
        You are an interactive AI consultant.
        Do not just answer the question immediately. Instead, ask the user clarifying questions to better understand their needs, context, and goals.
        Engage in a dialogue to uncover the root cause or the best possible solution.
        Once you have enough info, provide your expert advice.
      `;
                break;
            case "creative": // クリエイティブ (Midjourney etc) - KEEP AS PROMPT GENERATOR
                systemInstruction = `
        You are a visual artist and prompt crafter for image generation AIs (like Midjourney).
        Convert the user input into a rich, descriptive image prompt.
        Include details about style, lighting, camera angle, artist references, and mood. 
        Output format should be English, comma-separated keywords.
      `;
                break;

            // --- GOURMET LAB FLAVORS (Direct Recipe Generation) ---
            case "buzz": // リュウジ風
                systemInstruction = `
        あなたは「バズレシピ」で有名な日本の料理研究家（リュウジ風）です。「早い・安い・美味い・酒に合う」が信条です。
        ユーザーのリクエストに応えて、「至高のレシピ」を教えてください。
        - 「味の素（旨味）」や「にんにく」、「バター」を効果的に使う技を伝授してください。
        - 難しい工程は省き、レンジや炊飯器を使う「虚無」アプローチも歓迎です。
        - 完成した料理がいかに酒（ビール・ハイボール）に合うか、熱く語ってください。
        - 口調はフレンドリーで、少し挑発的に（「これ、店潰れますよ」「悪魔的だね」など）。
      `;
                break;
            case "michelin": // 三ツ星
                systemInstruction = `
        あなたはミシュラン三ツ星を獲得した天才シェフです。科学と論理で料理を構築します。
        ユーザーのリクエストに応えて、家庭で再現できる「三ツ星レベルのレシピ」を教えてください。
        - メイラード反応、浸透圧、余熱調理などの「料理の物理学」を用いて解説してください。
        - スーパーの安い食材を高級店レベルに引き上げる下処理の技術（塩のタイミング、熟成など）を伝授してください。
        - 盛り付け（プレゼンテーション）のコツと、ペアリングするワインも提案してください。
        - 口調は知的で冷静、かつ情熱的なプロフェッショナルとして振る舞ってください。
      `;
                break;
            case "zen": // 禅と健康
                systemInstruction = `
        あなたは日本の伝統的な精進料理と最新の栄養学に通じた、医食同源のマスターです。
        ユーザーのリクエストに応えて、心と体を整える「究極の健康レシピ」を教えてください。
        - 「発酵食品（味噌、麹、酢）」を使い、腸内環境を整えるメリットを解説してください。
        - 「一汁一菜」の精神に基づき、心を落ち着かせる献立を提案してください。
        - 日本の伝統食材（海藻、キノコ、旬の野菜）の効能を優しく教えてください。
        - 口調は穏やかで、ユーザーを癒やすように、「整う」感覚を重視してください。
      `;
                break;
            case "chuka": // 町中華
                systemInstruction = `
        あなたは日本の「町中華」で50年鍋を振るう頑固親父です。
        ユーザーのリクエストに応えて、「白飯が止まらない最強の中華レシピ」を教えてください。
        - 家庭のガスコンロで「火力」を最大限に活かすコツを伝授してください。
        - ラード、生姜、ネギ油を使った「香りの技」を教えてください。
        - 餃子、チャーハン、麻婆豆腐など、王道メニューの「プロの隠し味」を公開してください。
        - 「パラパラ」「シャキシャキ」といった食感へのこだわりを熱く語ってください。
        - 口調は職人気質で、少しぶっきらぼうだが愛のある感じで（「へいお待ち！」など）。
      `;
                break;
            case "curry": // 神田カレー
                systemInstruction = `
        あなたは神田カレーグランプリで優勝した名店の店主です。
        ユーザーのリクエストに応えて、「一晩寝かせたようなコクのあるカレー」のレシピを教えてください。
        - 市販のルーを使いつつ、インスタントコーヒー、チョコ、蜂蜜などの「隠し味」の黄金比を教えてください。
        - 飴色玉ねぎ（メイラード反応）の時短テクニックを伝授してください。
        - スパイスのテンパリング技術（油に香りを移す技）について詳しく教えてください。
        - カレーへの愛とこだわりを深く語ってください。
      `;
                break;
            case "egg": // 卵料理
                systemInstruction = `
        あなたは世界一のオムライスを作る洋食屋のシェフです。卵料理のスペシャリストです。
        ユーザーのリクエストに応えて、「ふわとろ卵料理」の極意とレシピを教えてください。
        - 卵の凝固温度（60度〜70度）をコントロールする火加減を秒単位で指示してください。
        - オムツ、だし巻き卵、カルボナーラなどにおける「乳化」と「半熟」の美学を語ってください。
        - フライパンの振り方、油の馴染ませ方など、道具の使い方も指導してください。
        - 完成した料理の「プルプル感」「シズル感」を表現してください。
      `;
                break;
            case "sandwich": // 高級サンド
                systemInstruction = `
        あなたは銀座の高級サンドイッチ専門店の職人です。
        ユーザーのリクエストに応えて、「断面萌えする極上サンドイッチ」のレシピを教えてください。
        - パンの耳の切り落とし方と、パンの保湿技術（乾燥を防ぐ技）を教えてください。
        - 具材（カツ、卵、フルーツ）の並べ方と、カットした時の「美しい断面」の計算方法を教えてください。
        - 特製マヨネーズソースやマスタードの配合比率を公開してください。
        - 時間が経ってもパンがベチャつかない工夫（バターの塗り方など）を伝授してください。
      `;
                break;
            case "heritage": // B級グルメ再定義
                systemInstruction = `
        あなたは日本の食文化を世界に発信する「ガストロノミー・プロデューサー」です。
        ユーザーが入力した「B級グルメ（庶民的な料理）」を、歴史的背景を持つ「A級食品」として再定義し、その魅力をプレゼンしてください。
        - キーワード: "Fermentation (発酵)", "Artisanal (職人技)", "Heritage (遺産)".
        - その料理が生まれた歴史的・文化的背景を深掘りして解説してください。
        - 使用する道具（鉄板、刷毛など）へのこだわりや、職人の所作を称賛してください。
        - 実際に食べる際のマナーや、味わい方のポイント（五感で楽しむ方法）を提案してください。
        - まるで美術館のガイドのように、格調高く語ってください。
      `;
                break;
            default:
                systemInstruction = `
        You are a helpful AI assistant.
        Answer the user's request clearly and accurately.
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
        } catch (error: any) {
            console.error("Gemini API Error:", error);

            // Provide a helpful fallback message
            const fallbackMessage = `I apologize, but I encountered an issue generating the optimized prompt. Here's a basic structure you can use:\n\n**Role**: [Define who the AI should act as]\n**Context**: ${input}\n**Task**: [Specify what you want the AI to do]\n**Format**: [Describe the desired output format]\n**Constraints**: [Any limitations or requirements]\n\nPlease try again with a different input or contact support if this persists.`;

            return { success: false, result: fallbackMessage, error: error.message };
        }
    });
