export const seoConfig = {
    en: {
        title: "Toolkit Lab | Privacy-First Web Tools",
        description: "Privacy-first web tools for everyone. GIF Converter, Video Converter, Image Editor, and PWA file transfer. Secure, fast, and 100% client-side.",
        keywords: "toolkit lab, web tools, gif converter, video converter, privacy tools, pwa, client-side",
        ogImage: "/og-image.png",
        pages: {
            "background-remover": {
                title: "Background Remover AI | Toolkit Lab",
                description: "Remove image backgrounds instantly in your browser using AI. 100% private, no upload to server.",
                keywords: "remove background, bg remover, ai background removal, transparent background"
            },
            "magic-eraser": {
                title: "Magic Eraser AI | Toolkit Lab",
                description: "Remove unwanted objects from photos using AI. Professional results right in your browser.",
                keywords: "magic eraser, remove object from photo, ai object removal, photo cleanup"
            },
            "svg-vectorizer": {
                title: "AI SVG Vectorizer | Toolkit Lab",
                description: "Convert JPG/PNG to high-quality SVG vectors using AI. Perfect for designers and developers.",
                keywords: "image to svg, vectorizer, ai vectorization, png to svg, bitmap to vector"
            }
        }
    },
    ja: {
        title: "Toolkit Lab | プライバシー重視のWebツール集",
        description: "登録不要・インストール不要のWebツール集。GIF作成、動画変換、画像編集、ファイル転送など。すべての処理がブラウザ内で完結する安心設計。",
        keywords: "toolkit lab, webツール, gif作成, 動画変換, プライバシー, pwa, ブラウザ完結",
        ogImage: "/og-image.png",
        pages: {
            "background-remover": {
                title: "AI背景削除・切り抜き | Toolkit Lab",
                description: "AIが画像から背景を瞬時に削除。ブラウザ完結型なので画像がサーバーに送信されず安全です。",
                keywords: "背景削除, 背景切り抜き, ai 背景 削除, 透過画像 作成, 無料"
            },
            "magic-eraser": {
                title: "AI消しゴム・物体除去 | Toolkit Lab",
                description: "写真に写り込んだ不要なものをAIが自然に消去。プライバシー保護や写真の修正に。",
                keywords: "消しゴムマジック, 物体除去, 不要なものを消す, ai 画像 修正, プライバシー保護"
            },
            "svg-vectorizer": {
                title: "AIベクター変換 (SVG) | Toolkit Lab",
                description: "画像を高品質なSVGベクターデータに変換。ロゴ制作やスケーラブルなデザインに最適。",
                keywords: "画像 ベクター変換, svg 変換, ai ベクタライズ, png svg 変換, 高画質"
            }
        }
    }
};

export type SupportedLanguage = keyof typeof seoConfig;
