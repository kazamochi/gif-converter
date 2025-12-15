export const videoFormats = [
    { id: 'mp4', name: 'MP4', extension: '.mp4' },
    { id: 'mov', name: 'MOV', extension: '.mov' },
    { id: 'avi', name: 'AVI', extension: '.avi' },
    { id: 'webm', name: 'WebM', extension: '.webm' },
    { id: 'mkv', name: 'MKV', extension: '.mkv' },
    { id: 'flv', name: 'FLV', extension: '.flv' },
    { id: 'wmv', name: 'WMV', extension: '.wmv' },
    { id: 'mpeg', name: 'MPEG', extension: '.mpeg' },
] as const;

export type VideoFormatId = typeof videoFormats[number]['id'];

// Helper to generate format SEO for a language
const generateFormatSEO = (lang: string) => {
    const templates = {
        en: (format: string) => ({
            title: `${format.toUpperCase()} to GIF Converter | Fast & Free Online Tool`,
            description: `Convert ${format.toUpperCase()} videos to GIF instantly in your browser. No upload required. Privacy-focused, fast, and free.`,
            keywords: `${format} to gif, ${format} gif converter, convert ${format} to gif online, free ${format} gif`,
        }),
        ja: (format: string) => ({
            title: `${format.toUpperCase()}からGIF変換 | 高速・無料オンラインツール`,
            description: `${format.toUpperCase()}動画をブラウザで瞬時にGIFに変換。アップロード不要。プライバシー重視、高速、無料。`,
            keywords: `${format} gif 変換, ${format} gif, ${format}からgif, 無料 ${format} gif`,
        }),
        es: (format: string) => ({
            title: `Convertidor ${format.toUpperCase()} a GIF | Herramienta Rápida y Gratuita`,
            description: `Convierte videos ${format.toUpperCase()} a GIF al instante en tu navegador. Sin carga requerida.`,
            keywords: `${format} a gif, convertidor ${format} gif, ${format} gif gratis`,
        }),
        pt: (format: string) => ({
            title: `Conversor ${format.toUpperCase()} para GIF | Ferramenta Rápida e Grátis`,
            description: `Converta vídeos ${format.toUpperCase()} em GIF instantaneamente no seu navegador.`,
            keywords: `${format} para gif, conversor ${format} gif, ${format} gif grátis`,
        }),
        de: (format: string) => ({
            title: `${format.toUpperCase()} zu GIF Konverter | Schnell & Kostenlos`,
            description: `Konvertieren Sie ${format.toUpperCase()}-Videos sofort in GIFs in Ihrem Browser.`,
            keywords: `${format} zu gif, ${format} gif konverter, ${format} gif kostenlos`,
        }),
        fr: (format: string) => ({
            title: `Convertisseur ${format.toUpperCase()} vers GIF | Rapide et Gratuit`,
            description: `Convertissez des vidéos ${format.toUpperCase()} en GIF instantanément dans votre navigateur.`,
            keywords: `${format} vers gif, convertisseur ${format} gif, ${format} gif gratuit`,
        }),
        zh: (format: string) => ({
            title: `${format.toUpperCase()}转GIF转换器 | 快速免费`,
            description: `在浏览器中即时将${format.toUpperCase()}视频转换为GIF。`,
            keywords: `${format}转gif, ${format} gif转换器, 免费${format} gif`,
        }),
        ko: (format: string) => ({
            title: `${format.toUpperCase()}에서 GIF 변환기 | 빠르고 무료`,
            description: `브라우저에서 ${format.toUpperCase()} 동영상을 즉시 GIF로 변환하세요.`,
            keywords: `${format} gif 변환, ${format} gif 변환기, 무료 ${format} gif`,
        }),
        ru: (format: string) => ({
            title: `Конвертер ${format.toUpperCase()} в GIF | Быстро и Бесплатно`,
            description: `Конвертируйте видео ${format.toUpperCase()} в GIF мгновенно в вашем браuzере.`,
            keywords: `${format} в gif, ${format} gif конвертер, бесплатный ${format} gif`,
        }),
        id: (format: string) => ({
            title: `Konverter ${format.toUpperCase()} ke GIF | Cepat & Gratis`,
            description: `Konversi video ${format.toUpperCase()} ke GIF secara instan di browser Anda.`,
            keywords: `${format} ke gif, konverter ${format} gif, ${format} gif gratis`,
        }),
    };

    const result: any = {};
    videoFormats.forEach(({ id }) => {
        result[id] = templates[lang as keyof typeof templates](id);
    });
    return result;
};

export const formatSEO = {
    en: generateFormatSEO('en'),
    ja: generateFormatSEO('ja'),
    es: generateFormatSEO('es'),
    pt: generateFormatSEO('pt'),
    de: generateFormatSEO('de'),
    fr: generateFormatSEO('fr'),
    zh: generateFormatSEO('zh'),
    ko: generateFormatSEO('ko'),
    ru: generateFormatSEO('ru'),
    id: generateFormatSEO('id'),
} as const;
