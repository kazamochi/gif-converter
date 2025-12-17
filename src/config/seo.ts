export const seoConfig = {
    en: {
        title: "Toolkit Lab | Privacy-First Web Tools",
        description: "Privacy-first web tools for everyone. GIF Converter, Video Converter, Image Editor, and PWA file transfer. Secure, fast, and 100% client-side.",
        keywords: "toolkit lab, web tools, gif converter, video converter, privacy tools, pwa, client-side",
        ogImage: "/og-image.png"
    },
    ja: {
        title: "Toolkit Lab | プライバシー重視のWebツール集",
        description: "登録不要・インストール不要のWebツール集。GIF作成、動画変換、画像編集、ファイル転送など。すべての処理がブラウザ内で完結する安心設計。",
        keywords: "toolkit lab, webツール, gif作成, 動画変換, プライバシー, pwa, ブラウザ完結",
        ogImage: "/og-image.png"
    }
};

export type SupportedLanguage = keyof typeof seoConfig;
