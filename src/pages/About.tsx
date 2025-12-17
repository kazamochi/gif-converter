import React from 'react';
import { ArrowLeft, Zap, Shield, Globe, Code, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
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

                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold text-white mb-4">{t('about.tech_stack.title')}</h2>
                            <p>{t('about.tech_stack.description')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                                {(t('about.tech_stack.items', { returnObjects: true }) as string[]).map((item, index) => (
                                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </ul>
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
            </div>
        </div>
    );
};
