import React from 'react';
import { ArrowLeft, Zap, Shield, Globe, Code, Github, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('about.back')}
            </Link>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                <h1 className="text-4xl font-bold text-white mb-8">{t('about.title')}</h1>

                <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('about.mission.title')}</h2>
                        <p className="text-lg">
                            {t('about.mission.description')}
                        </p>
                        <p dangerouslySetInnerHTML={{ __html: t('about.mission.goal') }} />
                    </section>

                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold text-white mb-6">{t('about.features.title')}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Shield className="w-6 h-6 text-green-400" />
                                    <h3 className="text-xl font-semibold text-white">{t('about.features.private.title')}</h3>
                                </div>
                                <p className="text-sm">
                                    {t('about.features.private.description')}
                                </p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                    <h3 className="text-xl font-semibold text-white">{t('about.features.fast.title')}</h3>
                                </div>
                                <p className="text-sm">
                                    {t('about.features.fast.description')}
                                </p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Globe className="w-6 h-6 text-blue-400" />
                                    <h3 className="text-xl font-semibold text-white">{t('about.features.offline.title')}</h3>
                                </div>
                                <p className="text-sm">
                                    {t('about.features.offline.description')}
                                </p>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Code className="w-6 h-6 text-purple-400" />
                                    <h3 className="text-xl font-semibold text-white">{t('about.features.open_source.title')}</h3>
                                </div>
                                <p className="text-sm">
                                    {t('about.features.open_source.description')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-16 space-y-12">
                        <h2 className="text-3xl font-bold text-white border-b border-slate-800 pb-4">
                            {t('about.showcase.title')}
                        </h2>

                        {/* Net Scouter Showcase */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest">
                                    Network Diagnostic
                                </div>
                                <h3 className="text-2xl font-bold text-white">Net Scouter</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {t('about.showcase.scouter.desc')}
                                </p>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        <span>{t('about.showcase.scouter.point1')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        <span>{t('about.showcase.scouter.point2')}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 aspect-video flex items-center justify-center group overflow-hidden relative">
                                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Activity className="w-16 h-16 text-green-500/20 group-hover:scale-110 transition-transform" />
                                <div className="absolute bottom-4 left-4 right-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-2/3 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* GIF Converter Showcase */}
                        <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 aspect-video flex items-center justify-center group overflow-hidden relative order-last md:order-first">
                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Zap className="w-16 h-16 text-indigo-500/20 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 border-2 border-indigo-500/20 rounded-full border-dashed animate-spin-slow" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                    Media Processing
                                </div>
                                <h3 className="text-2xl font-bold text-white">GIF Converter</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {t('about.showcase.gif.desc')}
                                </p>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                        <span>{t('about.showcase.gif.point1')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                        <span>{t('about.showcase.gif.point2')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Privacy-First Vision */}
                        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-8 text-center space-y-4">
                            <Shield className="w-12 h-12 text-indigo-400 mx-auto" />
                            <h3 className="text-2xl font-bold text-white">{t('about.vision.title')}</h3>
                            <p className="text-slate-400 max-w-2xl mx-auto italic">
                                {t('about.vision.desc')}
                            </p>
                        </div>
                    </section>

                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('about.tech_stack.title')}</h2>
                        <p>{t('about.tech_stack.description')}</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            {(t('about.tech_stack.items', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ul>
                    </section>

                    <section className="mt-12 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-3xl font-bold text-white">{t('about.developer_note.title')}</h2>
                        </div>

                        <div className="space-y-6 text-slate-300 leading-relaxed">
                            <p className="text-xl font-serif italic text-indigo-300 border-l-4 border-indigo-500 pl-4 py-2">
                                {t('about.developer_note.quote')}
                            </p>

                            <p>{t('about.developer_note.p1')}</p>
                            <p>{t('about.developer_note.p2')}</p>

                            <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-800">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    {t('about.developer_note.products.title')}
                                </h3>
                                <ul className="space-y-4 text-sm">
                                    <li dangerouslySetInnerHTML={{ __html: t('about.developer_note.products.prompt_pro') }} />
                                    <li dangerouslySetInnerHTML={{ __html: t('about.developer_note.products.warp_share') }} />
                                </ul>
                            </div>

                            <p>{t('about.developer_note.footer')}</p>

                            <div className="pt-4 border-t border-slate-800 text-right">
                                <p className="text-white font-semibold flex items-center justify-end gap-2">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    {t('about.developer_note.author')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('about.free_forever.title')}</h2>
                        <p dangerouslySetInnerHTML={{ __html: t('about.free_forever.description') }} />
                    </section>

                    <section className="mt-12 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t('about.contact.title')}</h2>
                        <p>
                            {t('about.contact.description')}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                                {t('about.contact.button')}
                            </Link>
                            <a href="https://github.com/kazamochi/gif-converter" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                                {t('about.contact.github')}
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-8">
                <AdSpace className="max-w-2xl mx-auto" slotId="about-footer" />
            </div>
        </>
    );
};
