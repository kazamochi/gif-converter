import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, ArrowRight, Check, Wifi, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolDescription } from '../../components/ToolDescription';

export const NetScouterProduct: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                    Real-time Analysis
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
                        Net Scouter
                    </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t('product.net.hero_desc', 'Ultimate hardware-accelerated network diagnostics. Analyze jitter, latency, and connection quality with tactical precision.')}
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/net-scouter"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                    >
                        <span>{t('product.launch_scouter', 'Launch Scouter')}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid md:grid-cols-3 gap-8 px-4 mb-20">
                <FeatureCard
                    icon={<Activity className="w-8 h-8 text-green-400" />}
                    title={t('product.net.jitter_title', 'Jitter Analysis')}
                    desc={t('product.net.jitter_desc')}
                />
                <FeatureCard
                    icon={<Wifi className="w-8 h-8 text-green-400" />}
                    title={t('product.net.speed_title', 'Speed Test')}
                    desc={t('product.net.speed_desc')}
                />
                <FeatureCard
                    icon={<Shield className="w-8 h-8 text-green-400" />}
                    title={t('product.net.privacy_title', 'Privacy First')}
                    desc={t('product.net.privacy_desc')}
                />
            </section>

            {/* Technical Detail */}
            <section className="bg-green-950/20 border border-green-500/20 rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {t('product.net.why_title', 'Why Net Scouter?')}
                        </h2>
                        <div className="space-y-4">
                            <CheckListItem text={t('product.net.point1', 'Bypass browser caching for real measurements')} />
                            <CheckListItem text={t('product.net.point2', 'Military-grade encryption for all data')} />
                            <CheckListItem text={t('product.net.point3', 'Zero-log policy: your data stays on your machine')} />
                        </div>
                    </div>
                    <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden group">
                        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <TrendingUp className="w-20 h-20 text-green-500/20 group-hover:scale-110 transition-transform" />
                        </div>
                        {/* Mock UI Element */}
                        <div className="absolute bottom-6 left-6 right-6 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4 animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="mt-20">
                <ToolDescription toolId="net-scouter" />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const CheckListItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3 text-slate-300">
        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-green-400" />
        </div>
        <span>{text}</span>
    </div>
);
