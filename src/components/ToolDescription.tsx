import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Zap, Shield, HelpCircle as FaqIcon, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface ToolDescriptionProps {
    toolId: string;
}

export const ToolDescription: React.FC<ToolDescriptionProps> = ({ toolId }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);

    // 翻訳データが存在しない場合は何も表示しない
    const description = t(`product.${toolId}.detail.description`, { defaultValue: '' });
    if (!description) return null;

    const features = t(`product.${toolId}.detail.features`, { returnObjects: true, defaultValue: [] }) as string[];
    const steps = t(`product.${toolId}.detail.steps`, { returnObjects: true, defaultValue: [] }) as string[];
    const faqs = t(`product.${toolId}.detail.faqs`, { returnObjects: true, defaultValue: [] }) as { q: string; a: string }[];

    return (
        <section className="mt-24 mb-16 px-4 max-w-4xl mx-auto border-t border-slate-800 pt-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-200">
                        {isOpen ? t('common.close_details', '詳細を閉じる') : t('common.show_details', '詳細な使い方・解説を表示')}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>

            {isOpen && (
                <div className="mt-12 grid md:grid-cols-3 gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-indigo-400" />
                                {t('common.what_is_this', 'このツールについて')}
                            </h2>
                            <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {steps.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-amber-400" />
                                    {t('common.how_to_use', '使い方')}
                                </h2>
                                <ol className="space-y-4">
                                    {steps.map((step, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                                {i + 1}
                                            </span>
                                            <p className="text-slate-400 pt-1">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Features */}
                    <div className="space-y-12">
                        {features.length > 0 && (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                    {t('common.features', '主な特徴')}
                                </h3>
                                <ul className="space-y-3">
                                    {features.map((feature, i) => (
                                        <li key={i} className="flex gap-2 items-start text-sm text-slate-400">
                                            <span className="text-emerald-500 mt-1">•</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {faqs.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaqIcon className="w-5 h-5 text-purple-400" />
                                    FAQ
                                </h3>
                                <div className="space-y-6">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="space-y-2">
                                            <h4 className="text-sm font-bold text-slate-200">Q. {faq.q}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed">A. {faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};
