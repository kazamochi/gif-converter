import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';
import { useTranslation } from 'react-i18next';

export const Terms: React.FC = () => {

    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('terms.back')}
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-white mb-8">{t('terms.title')}</h1>

                    <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.acceptance.title')}</h2>
                            <p>{t('terms.acceptance.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.service.title')}</h2>
                            <p>{t('terms.service.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.prohibited.title')}</h2>
                            <p>{t('terms.prohibited.content')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>{t('terms.prohibited.list.illegal')}</li>
                                <li>{t('terms.prohibited.list.copyright')}</li>
                                <li>{t('terms.prohibited.list.abuse')}</li>
                                <li>{t('terms.prohibited.list.malware')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.disclaimer.title')}</h2>
                            <p>{t('terms.disclaimer.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.ip.title')}</h2>
                            <p>{t('terms.ip.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.userContent.title')}</h2>
                            <p>{t('terms.userContent.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.ads.title')}</h2>
                            <p>{t('terms.ads.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.changes.title')}</h2>
                            <p>{t('terms.changes.content')}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{t('terms.contact.title')}</h2>
                            <p>
                                {t('terms.contact.content')}
                            </p>
                            <p className="mt-2">
                                <strong>Email:</strong> <a href="mailto:contact@toolkit-lab.com" className="text-indigo-400 hover:text-indigo-300">contact@toolkit-lab.com</a>
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-8">
                    <AdSpace className="max-w-2xl mx-auto" slotId="terms-footer" />
                </div>
            </div>
        </div>
    );
};
