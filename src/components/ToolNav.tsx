import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wand2, Video, Sparkles, Camera, Share2, Activity, Download } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const ToolNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();
    const { isInstallable, install } = usePWAInstall();

    // Categorized tools structure
    const categories = [
        {
            id: 'ai-tools',
            label: 'AI Image Tools',
            icon: Camera,
            tools: [
                { path: '/eraser/background-remover', label: 'Background Remover', icon: Camera, color: 'text-orange-500' },
                { path: '/eraser/magic-eraser', label: 'Magic Eraser', icon: Sparkles, color: 'text-purple-500' },
                { path: '/retro-instant', label: 'Retro Lab', icon: Camera, color: 'text-orange-500' },
                { path: '/image-tools', label: 'Image Editor', icon: Camera, color: 'text-rose-500' },
            ]
        },
        {
            id: 'converters',
            label: 'Converters',
            icon: Wand2,
            tools: [
                { path: '/creator/svg-vectorizer', label: 'SVG Vectorizer', icon: Wand2, color: 'text-emerald-500' },
                { path: '/gif-converter', label: 'GIF Converter', icon: Wand2 },
                { path: '/video-converter', label: 'Video Converter', icon: Video },
            ]
        },
        {
            id: 'utility',
            label: 'Utility',
            icon: Activity,
            tools: [
                { path: '/prompt-pro', label: 'Prompt Pro', icon: Sparkles },
                { path: '/warp-share', label: 'Warp Share', icon: Share2 },
                { path: '/net-scouter', label: 'Net Scouter', icon: Activity, color: 'text-green-400' },
            ]
        }
    ];

    const isActive = (path: string) => {
        if (path === '/gif-converter') {
            return location.pathname === '/gif-converter' || location.pathname.startsWith('/convert/');
        }
        return location.pathname === path;
    };

    const isCategoryActive = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.tools.some(tool => isActive(tool.path)) || false;
    };

    return (
        <nav className="w-full bg-slate-900/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <span className="sm:hidden text-sm">TOP</span>
                        <span className="hidden sm:inline">Toolkit Lab</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/"
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/'
                                ? 'text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            TOP
                            <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${location.pathname === '/' ? 'opacity-100' : 'opacity-0'}`} />
                        </Link>
                        {categories.map((category) => {
                            const CategoryIcon = category.icon;
                            const categoryIsActive = isCategoryActive(category.id);
                            return (
                                <div
                                    key={category.id}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(category.id)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${categoryIsActive || openDropdown === category.id
                                            ? 'text-white'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        <CategoryIcon className="w-4 h-4" />
                                        {category.label}
                                        <svg className={`w-3 h-3 transition-transform ${openDropdown === category.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>

                                        {/* Active/Hover Indicator Bar */}
                                        <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${categoryIsActive || openDropdown === category.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>

                                    {/* Dropdown Menu - Wrapped in a container to bridge the gap */}
                                    {openDropdown === category.id && (
                                        <div className="absolute top-full left-0 w-56 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {/* Decorative Arrow */}
                                            <div className="absolute top-1 left-6 w-3 h-3 bg-slate-800 border-l border-t border-white/10 rotate-45" />

                                            <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                                                {category.tools.map((tool) => {
                                                    const Icon = tool.icon;
                                                    const colorClass = (tool as any).color || '';
                                                    const toolActive = isActive(tool.path);
                                                    return (
                                                        <Link
                                                            key={tool.path}
                                                            to={tool.path}
                                                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${toolActive
                                                                ? 'bg-white/10 text-white'
                                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <Icon className={`w-4 h-4 ${toolActive ? '' : colorClass}`} />
                                                            {tool.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="ml-4 border-l border-white/10 pl-4 flex items-center gap-4">
                            {isInstallable && (
                                <button
                                    onClick={install}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-900 bg-indigo-400 hover:bg-indigo-300 rounded-full transition-colors animate-in fade-in zoom-in duration-300"
                                >
                                    <Download className="w-3 h-3" />
                                    Install App
                                </button>
                            )}
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    {isInstallable && (
                        <button
                            onClick={install}
                            className="md:hidden p-2 rounded-lg text-indigo-400 hover:text-white hover:bg-white/5 transition-colors mr-2"
                            aria-label="Install App"
                        >
                            <Download className="w-6 h-6" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === '/'
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                TOP
                            </Link>
                            {categories.map((category) => (
                                <div key={category.id} className="space-y-1">
                                    <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {category.label}
                                    </div>
                                    {category.tools.map((tool) => {
                                        const Icon = tool.icon;
                                        const colorClass = (tool as any).color || '';
                                        return (
                                            <Link
                                                key={tool.path}
                                                to={tool.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(tool.path)
                                                    ? 'bg-white/10 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 ${isActive(tool.path) ? '' : colorClass}`} />
                                                {tool.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                            <div className="pt-2 mt-2 border-t border-white/10">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
