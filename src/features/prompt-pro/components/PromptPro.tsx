import { useState, useEffect } from 'react';
import {
    Loader2, Copy, Check, Sparkles, Brain, Zap, MessageSquare, Palette,
    Utensils, Star, Leaf, Flame, Cookie, Egg, Sandwich, Castle
} from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../lib/firebase';
import { useTranslation } from 'react-i18next';
// i18n instance is used internally by useTranslation, but if we need direct access:
// import i18n from '../../../i18n';

// --- Types ---
type Category = 'business' | 'gourmet';
type BusinessFlavor = 'speed' | 'thought' | 'reverse' | 'creative';
type GourmetFlavor = 'buzz' | 'michelin' | 'zen' | 'chuka' | 'curry' | 'egg' | 'sandwich' | 'heritage';
type Flavor = BusinessFlavor | GourmetFlavor;

interface HistoryItem {
    id: string;
    timestamp: number;
    userPrompt: string;
    category: Category;
    flavor: Flavor;
    result: string;
}

// --- Constants ---
const businessFlavors = [
    { id: 'speed' as const, icon: Zap },
    { id: 'thought' as const, icon: Brain },
    { id: 'reverse' as const, icon: MessageSquare },
    { id: 'creative' as const, icon: Palette },
];

const gourmetFlavors = [
    { id: 'buzz' as const, icon: Flame },
    { id: 'michelin' as const, icon: Star },
    { id: 'zen' as const, icon: Leaf },
    { id: 'chuka' as const, icon: Utensils },
    { id: 'curry' as const, icon: Cookie },
    { id: 'egg' as const, icon: Egg },
    { id: 'sandwich' as const, icon: Sandwich },
    { id: 'heritage' as const, icon: Castle },
];

// --- Components ---

// 1. Wait Overlay (The Money Maker)
const WaitOverlay = ({ isVisible }: { isVisible: boolean }) => {
    const { t } = useTranslation();
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="text-center space-y-6 max-w-lg w-full px-4">
                {/* Animation */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">{t('prompt_pro.thinking_title')}</h3>
                    <p className="text-slate-400">{t('prompt_pro.thinking_desc')}</p>
                </div>

                {/* AD AREA (Placeholder for AdSense) */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 min-h-[250px] flex items-center justify-center">
                    <div className="text-sm text-slate-500">
                        📢 Professional Ad Space<br />
                        (High CPM Area)
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. Category Tabs
const CategoryTabs = ({
    category,
    onCategoryChange
}: {
    category: Category;
    onCategoryChange: (cat: Category) => void
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
            <button
                onClick={() => onCategoryChange('business')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${category === 'business'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
            >
                <Brain className="w-4 h-4" />
                <span>{t('prompt_pro.tab_business')}</span>
            </button>
            <button
                onClick={() => onCategoryChange('gourmet')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${category === 'gourmet'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
            >
                <Utensils className="w-4 h-4" />
                <span>{t('prompt_pro.tab_gourmet')}</span>
            </button>
        </div>
    );
};

// Helper Icon
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

// --- Main Component ---
const PromptPro = () => {
    const { t } = useTranslation();

    // State
    const [category, setCategory] = useState<Category>('business');
    const [flavor, setFlavor] = useState<Flavor>('speed');
    const [userPrompt, setUserPrompt] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const currentFlavors = category === 'business' ? businessFlavors : gourmetFlavors;

    // Load History on Mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('promptProHistory');
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load history', e);
        }
    }, []);

    // Helper: Add to History
    const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        const newHistory = [newItem, ...history].slice(0, 20); // Keep last 20 items
        setHistory(newHistory);
        localStorage.setItem('promptProHistory', JSON.stringify(newHistory));
    };

    // Helper: Clear History
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('promptProHistory');
    }

    // Helper: Share
    const handleShare = () => {
        const shareText = t('prompt_pro.share_text');
        const url = "https://toolkit-lab.com/prompt-pro";
        const hashtags = "PromptPro,WebToolKit,AI";
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
        window.open(twitterUrl, '_blank');
    };

    // Helper: Copy
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Main Handler
    const handleRefine = async () => {
        if (!userPrompt.trim()) return;

        setIsThinking(true);
        setResult('');
        setError('');

        try {
            // Check for mock mode or missing API key
            // Note: In Vite, we use import.meta.env
            const isMockMode = !functions || import.meta.env.VITE_USE_MOCK === 'true';

            let refinedText = "";

            if (isMockMode) {
                // Determine mock response based on flavor
                // Simulating network delay for realism
                await new Promise(resolve => setTimeout(resolve, 3000));

                const mockTemplates = t('prompt_pro.mock_outputs', { returnObjects: true }) as Record<string, string>;
                const template = mockTemplates[flavor] || mockTemplates['speed'];

                refinedText = template.replace('{{input}}', userPrompt);
            } else {
                // Real API Call
                const refinePrompt = httpsCallable<{ input: string; flavor: string; category: string }, { result: string }>(functions, 'refinePrompt');
                const response = await refinePrompt({
                    input: userPrompt,
                    flavor,
                    category
                });
                refinedText = response.data.result;
            }

            setResult(refinedText);

            // Add to History
            addToHistory({
                userPrompt,
                category,
                flavor,
                result: refinedText
            });

        } catch (err: any) {
            console.error(err);
            // Fallback to mock on error (graceful degradation)
            const mockTemplates = t('prompt_pro.mock_outputs', { returnObjects: true }) as Record<string, string>;
            const template = mockTemplates[flavor] || mockTemplates['speed'];
            const fallbackText = template.replace('{{input}}', userPrompt);

            setResult(fallbackText);
            setError(t('prompt_pro.error_fallback'));

            // Also add fallback to history so user doesn't lose data
            addToHistory({
                userPrompt,
                category,
                flavor,
                result: fallbackText
            });

        } finally {
            setIsThinking(false);
        }
    };

    // Update flavor when category changes if current flavor is invalid
    const handleCategoryChange = (newCategory: Category) => {
        setCategory(newCategory);

        // Reset flavor to first in category if switching
        if (newCategory === 'business') {
            setFlavor('speed');
        } else {
            setFlavor('buzz');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <WaitOverlay isVisible={isThinking} />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 ring-1 ring-indigo-500/30">
                        <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
                        Prompt Pro <span className="text-indigo-500">V2</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {t('prompt_pro.tagline')}
                    </p>
                </header>

                {/* Main Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl ring-1 ring-white/5">

                    {/* Category Tabs */}
                    <div className="mb-8">
                        <CategoryTabs category={category} onCategoryChange={handleCategoryChange} />
                    </div>

                    <div className="space-y-8">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                {t('prompt_pro.input_label')}
                            </label>
                            <textarea
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder={t('prompt_pro.input_placeholder')}
                                className="w-full h-32 bg-slate-950/50 rounded-xl border border-slate-700 p-4 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder-slate-600"
                            />
                        </div>

                        {/* Flavors Grid */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                {t('prompt_pro.flavor_label')}
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {currentFlavors.map((f) => {
                                    const Icon = f.icon;
                                    const isSelected = flavor === f.id;
                                    const isBusiness = category === 'business';

                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => setFlavor(f.id)}
                                            className={`relative group p-4 rounded-xl border transition-all duration-300 text-left ${isSelected
                                                ? isBusiness
                                                    ? 'bg-indigo-600 border-indigo-500 shadow-indigo-900/20 shadow-lg'
                                                    : 'bg-orange-600 border-orange-500 shadow-orange-900/20 shadow-lg'
                                                : 'bg-slate-800/30 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                                                <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                    {t(`prompt_pro.flavors.${f.id}`)}
                                                </span>
                                            </div>
                                            {/* We can add description tooltip here if needed */}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleRefine}
                            disabled={isThinking || !userPrompt.trim()}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${isThinking
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                                }`}
                        >
                            {isThinking ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    {t('prompt_pro.btn_thinking')}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    {t('prompt_pro.btn_generate')}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />

                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-400" />
                                {t('prompt_pro.result_title')}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShare()}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white flex items-center gap-2"
                                    title={t('prompt_pro.share')}
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="text-sm font-medium hidden sm:inline">{t('prompt_pro.share')}</span>
                                </button>
                                <button
                                    onClick={() => copyToClipboard(result)}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
                                >
                                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    <span className="text-sm font-medium">
                                        {isCopied ? t('prompt_pro.copied') : t('prompt_pro.copy')}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-xl p-6 font-mono text-sm md:text-base leading-relaxed text-slate-300 whitespace-pre-wrap border border-slate-800/50">
                            {result}
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-yellow-500/10 text-yellow-500 text-sm rounded-lg flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* History Section (Bottom List) */}
                {history.length > 0 && (
                    <div className="animate-in fade-in duration-700 pt-8 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-400 flex items-center gap-2">
                                <ClockIcon /> {t('prompt_pro.history_title')}
                            </h3>
                            <button
                                onClick={clearHistory}
                                className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                            >
                                {t('prompt_pro.history_clear')}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-slate-900/30 rounded-xl p-4 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all cursor-pointer"
                                    onClick={() => {
                                        setUserPrompt(item.userPrompt);
                                        setCategory(item.category);
                                        setFlavor(item.flavor);
                                        setResult(item.result);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.category === 'business' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-900/50 text-orange-400'
                                                }`}>
                                                {t(`prompt_pro.tab_${item.category}`)}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {t(`prompt_pro.flavors.${item.flavor}`)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare();
                                                }}
                                                className="text-slate-600 hover:text-white p-1"
                                                title={t('prompt_pro.share')}
                                            >
                                                <MessageSquare className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs text-slate-600 font-mono">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-1 mb-2 font-medium">
                                        "{item.userPrompt}"
                                    </p>
                                    <div className="text-xs text-slate-500 font-mono line-clamp-2 pl-2 border-l-2 border-slate-800 group-hover:border-indigo-500/30">
                                        {item.result}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Ad Placeholder */}
                <div className="bg-slate-800/20 rounded-lg p-2 flex items-center justify-center border border-dashed border-slate-800">
                    <AdSpace slotId="footer-ad" />
                </div>
            </div>
        </div>
    );
};

export default PromptPro;
