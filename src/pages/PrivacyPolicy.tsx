import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Converter
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                    <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                        <p className="text-sm text-slate-500">Last updated: December 15, 2024</p>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Global Ultra-Fast GIF Converter ("we," "our," or "us"). We are committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, and safeguard your information when you use our browser-based
                                video to GIF conversion service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Data Collection</h2>
                            <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">2.1 Video Processing</h3>
                            <p>
                                <strong className="text-green-400">Your files never leave your device.</strong> All video processing is performed
                                entirely in your browser using WebAssembly (ffmpeg.wasm). We do not upload, store, or have access to any videos
                                or GIFs you create.
                            </p>

                            <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">2.2 Analytics & Cookies</h3>
                            <p>We use the following third-party services that may collect data:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Google Analytics:</strong> To understand how users interact with our service (page views, session duration, etc.)</li>
                                <li><strong>Google AdSense:</strong> To display advertisements. AdSense uses cookies to serve ads based on your prior visits.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Information</h2>
                            <p>The limited data we collect is used to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Improve user experience and service performance</li>
                                <li>Analyze usage patterns and trends</li>
                                <li>Display relevant advertisements</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Your Rights (GDPR Compliance)</h2>
                            <p>If you are in the European Economic Area (EEA), you have the following rights:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                                <li><strong>Right to Object:</strong> Object to processing of your data</li>
                                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Third-Party Services</h2>
                            <p>We use the following third-party services:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a></li>
                                <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Cookies</h2>
                            <p>
                                We use cookies and similar tracking technologies to improve your experience. You can control cookies through
                                your browser settings. Note that disabling cookies may affect the functionality of our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Data Security</h2>
                            <p>
                                Since all processing happens in your browser, your files are inherently secure. We implement industry-standard
                                security measures to protect any analytics data collected.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Children's Privacy</h2>
                            <p>
                                Our service is not directed to children under 13. We do not knowingly collect personal information from children
                                under 13. If you believe we have collected such information, please contact us immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                                Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="mt-2">
                                <strong>Email:</strong> <a href="mailto:privacy@yourdomain.com" className="text-indigo-400 hover:text-indigo-300">privacy@yourdomain.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
