import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wand2 } from 'lucide-react';
import { AdSpace } from '../../../components/AdSpace';
import { ToolDescription } from '../../../components/ToolDescription';

const SVGVectorizerPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-500">
                    {t('svg_vectorizer.title')}
                </h1>
                <p className="text-slate-400">
                    {t('svg_vectorizer.subtitle')}
                </p>
            </div>

            <AdSpace slotId="ai-creator-top" className="my-8" />

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Wand2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('svg_vectorizer.status')}</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    {t('svg_vectorizer.desc')}
                </p>
            </div>

            <ToolDescription toolId="svg-vectorizer" />
            <AdSpace slotId="ai-creator-bottom" className="mt-12" />
        </div>
    );
};

export default SVGVectorizerPage;
