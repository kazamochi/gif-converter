import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {

    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('privacy.back')}
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-white mb-8">{t('privacy.title')}</h1>

                    <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.intro.title')}</h2>
                            <p>{t('privacy.intro.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.collection.title')}</h2>
                            <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">{t('privacy.collection.process_title')}</h3>
                            <p>
                                <strong className="text-green-400">{t('privacy.collection.process_content')}</strong>
                            </p>

                            <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">{t('privacy.collection.analytics_title')}</h3>
                            <p>{t('privacy.collection.analytics_content')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Google Analytics:</strong> {t('privacy.collection.analytics_list.ga')}</li>
                                <li><strong>Google AdSense:</strong> {t('privacy.collection.analytics_list.ads')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.use.title')}</h2>
                            <p>{t('privacy.use.content')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>{t('privacy.use.list.ux')}</li>
                                <li>{t('privacy.use.list.analytics')}</li>
                                <li>{t('privacy.use.list.ads')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.rights.title')}</h2>
                            <p>{t('privacy.rights.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.thirdparty.title')}</h2>
                            <p>{t('privacy.thirdparty.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.cookies.title')}</h2>
                            <p>{t('privacy.cookies.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.security.title')}</h2>
                            <p>{t('privacy.security.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.retention.title')}</h2>
                            <p>{t('privacy.retention.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.children.title')}</h2>
                            <p>{t('privacy.children.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.changes.title')}</h2>
                            <p>{t('privacy.changes.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('privacy.contact.title')}</h2>
                            <p>
                                {t('privacy.contact.content')}
                            </p>
                            <p className="mt-2">
                                <strong>Email:</strong> <a href="mailto:contact@toolkit-lab.com" className="text-indigo-400 hover:text-indigo-300">contact@toolkit-lab.com</a>
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-8">
                    <AdSpace className="max-w-2xl mx-auto" slotId="privacy-footer" />
                </div>
            </div>
        </div>
    );
};
