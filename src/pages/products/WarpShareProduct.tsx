import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Smartphone, Globe, ArrowRight, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../../components/Layout';

export const WarpShareProduct: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Layout maxWidth="max-w-6xl">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                    Secure P2P File Transfer
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
                        Warp Share
                    </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t('product.warp.hero_desc')}
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/warp-share"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                    >
                        <span>{t('product.start_sharing', 'Start Sharing')}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid md:grid-cols-3 gap-8 px-4 mb-20">
                <FeatureCard
                    icon={<Lock className="w-8 h-8 text-indigo-400" />}
                    title={t('product.warp.secure_title', 'End-to-End Encrypted')}
                    desc={t('product.warp.secure_desc')}
                />
                <FeatureCard
                    icon={<Zap className="w-8 h-8 text-indigo-400" />}
                    title={t('product.warp.speed_title', 'Lightning Fast')}
                    desc={t('product.warp.speed_desc')}
                />
                <FeatureCard
                    icon={<Smartphone className="w-8 h-8 text-indigo-400" />}
                    title={t('product.warp.cross_title', 'Cross Platform')}
                    desc={t('product.warp.cross_desc')}
                />
            </section>

            {/* Technical Detail */}
            <section className="bg-indigo-950/30 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center">
                <div className="inline-block p-4 bg-indigo-500/10 rounded-full mb-6">
                    <Globe className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                    {t('product.warp.pwa_title')}
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                    {t('product.warp.pwa_desc')}
                </p>
            </section>
        </Layout >
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);
