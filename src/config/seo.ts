export const seoConfig = {
    en: {
        title: "Global Ultra-Fast GIF Converter | Free Online Video to GIF",
        description: "Convert videos to GIFs instantly in your browser. No upload required. Privacy-focused, fast, and free. Supports MP4, MOV, AVI, WebM. Multi-language support (More coming soon).",
        keywords: "gif converter, video to gif, online gif maker, free gif converter, mp4 to gif, mov to gif, browser gif converter",
        ogImage: "/og-image.png"
    },
    ja: {
        title: "グローバル超高速GIFコンバーター | 無料オンライン動画→GIF変換",
        description: "ブラウザで動画を瞬時にGIFに変換。アップロード不要。プライバシー重視、高速、無料。MP4, MOV, AVI, WebM対応。多言語対応（順次追加予定）。",
        keywords: "gif 変換, 動画 gif, オンライン gif 作成, 無料 gif 変換, mp4 gif, mov gif, ブラウザ gif 変換",
        ogImage: "/og-image.png"
    }
};

export type SupportedLanguage = keyof typeof seoConfig;
