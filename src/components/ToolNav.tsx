import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wand2, Video, Sparkles, Camera, Sliders } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export const ToolNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const tools = [
        { path: '/gif-converter', label: 'GIF Converter', icon: Wand2 },
        { path: '/video-converter', label: 'Video Converter', icon: Video },
        { path: '/prompt-pro', label: 'Prompt Pro', icon: Sparkles },
        { path: '/retro-instant', label: 'Retro Lab', icon: Camera },
        { path: '/image-tools', label: 'Image Editor', icon: Sliders },
    ];

    const isActive = (path: string) => {
        if (path === '/gif-converter') {
            return location.pathname === '/gif-converter' || location.pathname.startsWith('/convert/');
        }
        return location.pathname === path;
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
                        <span className="hidden sm:inline">Toolkit Lab</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {tools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.path}
                                    to={tool.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(tool.path)
                                        ? 'bg-white/10 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tool.label}
                                </Link>
                            );
                        })}
                        <div className="ml-4 border-l border-white/10 pl-4">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
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
                            {tools.map((tool) => {
                                const Icon = tool.icon;
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
                                        <Icon className="w-5 h-5" />
                                        {tool.label}
                                    </Link>
                                );
                            })}
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
