import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../../components/Layout';
import { ToolDescription } from '../../components/ToolDescription';

export const NetScouterProduct: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Layout maxWidth="max-w-6xl">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                    Professional Network Diagnostics
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                        Net Scouter
                    </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t('product.scouter.hero_desc')}
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/net-scouter"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                    >
                        <span>{t('product.launch_tool', 'Launch Tool')}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid md:grid-cols-3 gap-8 px-4 mb-20">
                <FeatureCard
                    icon={<Shield className="w-8 h-8 text-green-400" />}
                    title={t('product.scouter.ip_title', 'IP Scouter')}
                    desc={t('product.scouter.ip_desc')}
                />
                <FeatureCard
                    icon={<Activity className="w-8 h-8 text-green-400" />}
                    title={t('product.scouter.jitter_title', 'Jitter Radar')}
                    desc={t('product.scouter.jitter_desc')}
                />
                <FeatureCard
                    icon={<Zap className="w-8 h-8 text-green-400" />}
                    title={t('product.scouter.bloat_title', 'Bufferbloat Test')}
                    desc={t('product.scouter.bloat_desc')}
                />
            </section>

            {/* Visual Showcase (Mockup) */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-green-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">
                            {t('product.scouter.analysis_title')}
                        </h2>
                        <ul className="space-y-4">
                            {(t('product.scouter.analysis_points', { returnObjects: true }) as string[]).map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-2xl">
                        {/* Mock Code/Data */}
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-2">
                                <span>DIAGNOSTIC_RESULT</span>
                                <span className="text-green-500">PASSED</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-slate-600 text-xs uppercase">Jitter</div>
                                    <div className="text-green-400">4.2 ms</div>
                                </div>
                                <div>
                                    <div className="text-slate-600 text-xs uppercase">Packet Loss</div>
                                    <div className="text-green-400">0.0 %</div>
                                </div>
                                <div>
                                    <div className="text-slate-600 text-xs uppercase">WebRTC Leak</div>
                                    <div className="text-emerald-400">SECURE</div>
                                </div>
                                <div>
                                    <div className="text-slate-600 text-xs uppercase">Bufferbloat</div>
                                    <div className="text-green-400">GRADE A+</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ToolDescription toolId="net-scouter" />
        </Layout>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);
