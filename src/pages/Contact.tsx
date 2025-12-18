import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';
import { useTranslation } from 'react-i18next';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSending(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        try {
            if (!functions) throw new Error("Firebase Functions not initialized");

            const submitContact = httpsCallable(functions, 'submitContact');
            await submitContact({
                email,
                subject,
                message,
                language: window.localStorage.getItem('i18nextLng') || 'ja'
            });

            setSubmitted(true);
        } catch (err: any) {
            console.error("Contact submit error:", err);
            setError(t('contact.error'));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('contact.back')}
            </Link>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                <h1 className="text-4xl font-bold text-white mb-8">{t('contact.title')}</h1>

                {!submitted ? (
                    <>
                        <p className="text-slate-300 mb-8">
                            {t('contact.description')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                                    {t('contact.form.email.label')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    disabled={isSending}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                                    placeholder={t('contact.form.email.placeholder')}
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-300 mb-2">
                                    {t('contact.form.subject.label')}
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    disabled={isSending}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                                    placeholder={t('contact.form.subject.placeholder')}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                                    {t('contact.form.message.label')}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    disabled={isSending}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50"
                                    placeholder={t('contact.form.message.placeholder')}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {t('contact.form.submit')}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">{t('contact.success.title')}</h2>
                        <p className="text-slate-300 mb-6">
                            {t('contact.success.description')}
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                            {t('contact.success.another')}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <AdSpace className="max-w-2xl mx-auto" slotId="contact-footer" />
            </div>
        </>
    );
};
