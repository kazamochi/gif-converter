import React from 'react';
import { ArrowLeft, Zap, Shield, Globe, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Converter
                </Link>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-white mb-8">About Us</h1>

                    <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Mission</h2>
                            <p className="text-lg">
                                We believe that powerful tools should be accessible to everyone, everywhere, without compromising privacy or requiring expensive software.
                            </p>
                            <p>
                                Global Ultra-Fast GIF Converter was created to provide a <strong className="text-indigo-400">free, fast, and privacy-focused</strong> solution
                                for converting videos to GIFs directly in your browser.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold text-white mb-6">Why Browser-Based?</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Shield className="w-6 h-6 text-green-400" />
                                        <h3 className="text-xl font-semibold text-white">100% Private</h3>
                                    </div>
                                    <p className="text-sm">
                                        Your files never leave your device. All processing happens locally in your browser using WebAssembly.
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Zap className="w-6 h-6 text-yellow-400" />
                                        <h3 className="text-xl font-semibold text-white">Lightning Fast</h3>
                                    </div>
                                    <p className="text-sm">
                                        No upload/download delays. Processing starts instantly and runs at full speed on your hardware.
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Globe className="w-6 h-6 text-blue-400" />
                                        <h3 className="text-xl font-semibold text-white">Works Offline</h3>
                                    </div>
                                    <p className="text-sm">
                                        Once loaded, the converter works even without an internet connection. Perfect for travel or limited connectivity.
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Code className="w-6 h-6 text-purple-400" />
                                        <h3 className="text-xl font-semibold text-white">Open Source</h3>
                                    </div>
                                    <p className="text-sm">
                                        Built with modern web technologies: React, TypeScript, ffmpeg.wasm, and Tailwind CSS.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold text-white mb-4">Technology Stack</h2>
                            <p>Our converter is powered by:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                                <li><strong>FFmpeg.wasm:</strong> The legendary video processing library, compiled to WebAssembly</li>
                                <li><strong>React + TypeScript:</strong> For a robust and type-safe user interface</li>
                                <li><strong>Vite:</strong> Lightning-fast build tool and development server</li>
                                <li><strong>Tailwind CSS:</strong> For beautiful, responsive design</li>
                                <li><strong>i18next:</strong> Supporting 10 languages for global accessibility</li>
                            </ul>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold text-white mb-4">Supported Languages</h2>
                            <p>We support 10 languages to make our tool accessible worldwide:</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                                {['🇺🇸 English', '🇯🇵 日本語', '🇪🇸 Español', '🇧🇷 Português', '🇩🇪 Deutsch',
                                    '🇫🇷 Français', '🇨🇳 中文', '🇰🇷 한국어', '🇷🇺 Русский', '🇮🇩 Indonesia'].map((lang) => (
                                        <div key={lang} className="bg-slate-800/30 border border-slate-700 rounded-lg px-3 py-2 text-sm text-center">
                                            {lang}
                                        </div>
                                    ))}
                            </div>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold text-white mb-4">Free Forever</h2>
                            <p>
                                This tool is and will always be <strong className="text-green-400">100% free</strong>. We believe in democratizing access to powerful tools.
                                Our service is supported by non-intrusive advertisements, which help us cover hosting costs and continue improving the service.
                            </p>
                        </section>

                        <section className="mt-12 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                            <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
                            <p>
                                Have feedback, suggestions, or found a bug? We'd love to hear from you!
                            </p>
                            <p className="mt-4">
                                <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                                    Contact Us →
                                </Link>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
