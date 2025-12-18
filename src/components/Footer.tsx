import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: t('landing.footer.tools.title'),
            links: [
                { name: 'Net Scouter', path: '/product/net-scouter' },
                { name: 'Warp Share', path: '/product/warp-share' },
            ]
        },
        {
            title: t('landing.footer.social.title'),
            links: [
                { name: t('landing.footer.about'), path: '/about' },
                { name: t('landing.footer.social.impact'), path: '/social-impact' },
                { name: t('landing.footer.privacy'), path: '/privacy' },
                { name: t('landing.footer.terms'), path: '/terms' },
            ]
        },
        {
            title: t('landing.footer.support.title'),
            links: [
                { name: t('landing.footer.support.contact'), path: '/contact' },
            ]
        }
    ];

    return (
        <footer className="mt-20 border-t border-zinc-800 bg-black/40 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-4 inline-block">
                            Toolkit Lab
                        </Link>
                        <p className="text-zinc-500 text-xs leading-relaxed max-w-[200px]">
                            {t('landing.subtitle')}
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="https://github.com/kazamochi/gif-converter" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="text-zinc-200 font-bold text-sm mb-4 uppercase tracking-wider">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            to={link.path}
                                            className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-zinc-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-600">
                    <div className="flex items-center gap-2">
                        <span>© 2024-{currentYear} Toolkit Lab.</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter">System: Stable</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                            <Activity className="w-3 h-3" />
                            <span>100% Client-Side</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
