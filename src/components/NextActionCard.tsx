import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NextActionCardProps {
    title: string;
    description: string;
    buttonText: string;
    to: string;
    icon: LucideIcon;
    color?: string; // e.g. "text-indigo-400"
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
    title,
    description,
    buttonText,
    to,
    icon: Icon,
    color = "text-indigo-400"
}) => {
    return (
        <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group text-left">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-75" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className={`p-4 bg-slate-800 rounded-xl border border-slate-700 ${color} shadow-lg shrink-0`}>
                    <Icon className="w-8 h-8" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Next Action
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400">
                        {description}
                    </p>
                </div>

                <Link
                    to={to}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-semibold transition-all group-hover:scale-105 whitespace-nowrap"
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};
