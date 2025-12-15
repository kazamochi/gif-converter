import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Contact: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mailto fallback
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        window.location.href = `mailto:contact@yourdomain.com?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Converter
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

                    {!submitted ? (
                        <>
                            <p className="text-slate-300 mb-8">
                                Have a question, suggestion, or found a bug? We'd love to hear from you!
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-300 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Tell us more..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>

                            <div className="mt-12 pt-8 border-t border-slate-800">
                                <h2 className="text-xl font-semibold text-white mb-4">Other Ways to Reach Us</h2>
                                <div className="space-y-3 text-slate-300">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-indigo-400" />
                                        <span>Email: <a href="mailto:contact@yourdomain.com" className="text-indigo-400 hover:text-indigo-300">contact@yourdomain.com</a></span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                            <p className="text-slate-300 mb-6">
                                Your email client should open shortly. If not, please email us directly at contact@yourdomain.com
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold"
                            >
                                Send Another Message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
