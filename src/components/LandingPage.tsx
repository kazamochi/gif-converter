import { Link } from 'react-router-dom';
import { Wand2, Video, Sparkles, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const { t } = useTranslation();

    const tools = [
        {
            id: 'gif-converter',
            path: '/gif-converter',
            icon: Wand2,
            nameKey: 'landing.tools.gif.name',
            descKey: 'landing.tools.gif.desc'
        },
        {
            id: 'video-converter',
            path: '/video-converter',
            icon: Video,
            nameKey: 'landing.tools.video.name',
            descKey: 'landing.tools.video.desc'
        },
        {
            id: 'prompt-pro',
            path: '/prompt-pro',
            icon: Sparkles,
            nameKey: 'landing.tools.prompt.name',
            descKey: 'landing.tools.prompt.desc'
        },
        {
            id: 'retro-instant',
            path: '/retro-instant',
            icon: Camera,
            nameKey: 'landing.tools.retro.name',
            descKey: 'landing.tools.retro.desc'
        },
        {
            id: 'image-tools',
            path: '/image-tools',
            icon: Camera,
            nameKey: 'landing.tools.image.name',
            descKey: 'landing.tools.image.desc',
            color: 'from-amber-400 to-orange-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-zinc-900">
            {/* Hero Section */}
            <div className="text-center py-8 md:py-12 lg:py-16 px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
                    Toolkit Lab
                </h1>
                <p className="text-slate-400 text-sm md:text-base">{t('landing.subtitle')}</p>
            </div>

            {/* Tool Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 pb-16">
                {tools.map(tool => {
                    const Icon = tool.icon;
                    return (
                        <Link to={tool.path} key={tool.id}>
                            <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:scale-105 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl group ${tool.color ? 'hover:shadow-orange-500/20' : 'hover:shadow-indigo-500/10'
                                }`}>
                                <div className={`mb-4 transition-colors ${tool.color
                                    ? `bg-gradient-to-br ${tool.color} bg-clip-text text-transparent`
                                    : 'text-indigo-400 group-hover:text-indigo-300'
                                    }`}>
                                    <Icon className={`w-12 h-12 ${tool.color ? 'text-amber-400' : ''}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{t(tool.nameKey)}</h3>
                                <p className="text-sm text-slate-400">{t(tool.descKey)}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-8 mt-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p className="text-zinc-600">© 2025 Toolkit Lab. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            <Link to="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                {t('landing.footer.privacy')}
                            </Link>
                            <Link to="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                {t('landing.footer.terms')}
                            </Link>
                            <Link to="/about" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                {t('landing.footer.about')}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
