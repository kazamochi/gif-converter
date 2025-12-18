import { Link } from 'react-router-dom';
import { Wand2, Video, Sparkles, Camera, Share2, Activity } from 'lucide-react';
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
            descKey: 'landing.tools.retro.desc',
            color: 'from-orange-400 to-amber-500'
        },
        {
            id: 'image-tools',
            path: '/image-tools',
            icon: Camera,
            nameKey: 'landing.tools.image.name',
            descKey: 'landing.tools.image.desc',
            color: 'from-pink-400 to-rose-500'
        },
        {
            id: 'warp-share',
            path: '/warp-share',
            icon: Share2,
            nameKey: 'landing.tools.warp.name',
            descKey: 'landing.tools.warp.desc',
            color: 'from-indigo-400 to-purple-500'
        },
        {
            id: 'net-scouter',
            path: '/net-scouter',
            icon: Activity,
            nameKey: 'landing.tools.scouter.name',
            descKey: 'landing.tools.scouter.desc',
            color: 'from-green-400 to-emerald-500'
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-12 lg:mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
                    Toolkit Lab
                </h1>
                <p className="text-slate-300 text-sm md:text-base">{t('landing.subtitle')}</p>
            </div>

            {/* Tool Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 pb-8">
                {tools.map(tool => {
                    const Icon = tool.icon;
                    return (
                        <Link to={tool.path} key={tool.id}>
                            <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full hover:scale-105 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl group ${tool.color ? 'hover:shadow-orange-500/20' : 'hover:shadow-indigo-500/10'
                                }`}>
                                <div className={`mb-4 transition-colors ${tool.color
                                    ? `bg-gradient-to-br ${tool.color} bg-clip-text text-transparent`
                                    : 'text-indigo-400 group-hover:text-indigo-300'
                                    }`}>
                                    <Icon className={`w-12 h-12 ${tool.color ? 'text-amber-400' : ''}`} />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">{t(tool.nameKey)}</h2>
                                <p className="text-sm text-slate-300">{t(tool.descKey)}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default LandingPage;
