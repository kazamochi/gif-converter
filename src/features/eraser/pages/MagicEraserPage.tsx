import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { ToolDescription } from '../../../components/ToolDescription';

const MagicEraserPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                    {t('magic_eraser.title')}
                </h1>
                <p className="text-slate-400">
                    {t('magic_eraser.subtitle')}
                </p>
            </div>

            <AdSpace slotId="ai-eraser-top" className="my-8" />

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('magic_eraser.status')}</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    {t('magic_eraser.desc')}
                </p>
            </div>

            <ToolDescription toolId="magic-eraser" />
            <AdSpace slotId="ai-eraser-bottom" className="mt-12" />
        </div>
    );
};

export default MagicEraserPage;
