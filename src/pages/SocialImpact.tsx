
import { Heart, Globe, Lightbulb, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';

import { useTranslation } from 'react-i18next';

export const SocialImpact = () => {
    const { t } = useTranslation();
    return (
        <>
            {/* Header / Mission Statement */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Home
                </Link>
            </div>

            <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 bg-pink-500/10 rounded-full mb-4">
                    <Heart className="w-8 h-8 text-pink-400" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                    Tech for Good
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Toolkit Lab empowers creators worldwide with free, professional-grade tools.
                    <br />
                    We believe technology should be accessible to everyone, everywhere.
                </p>
            </section>

            {/* Impact Metrics (Mock) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Globe, label: t('social.metrics.global_users'), value: "120+", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { icon: Lightbulb, label: t('social.metrics.ideas_realized'), value: "50k+", color: "text-amber-400", bg: "bg-amber-500/10" },
                    { icon: GraduationCap, label: t('social.metrics.education_supported'), value: "Future", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm flex flex-col items-center text-center hover:bg-slate-800/80 transition-all group">
                        <div className={`p-3 rounded-xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* CSR / Mission Details */}
            <section className="space-y-8">
                <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-8 bg-indigo-500 rounded-full"></span>
                        {t('social.commitment.title')}
                    </h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p dangerouslySetInnerHTML={{ __html: t('social.commitment.desc') }} />
                        <ul className="grid gap-4 mt-4 text-left">
                            {(t('social.support_list', { returnObjects: true }) as string[]).map((item, i) => (
                                <li key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <CheckIcon />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* High Value Ad Space (CSR Context) */}
                <div className="py-8">
                    <p className="text-center text-xs text-slate-500 mb-2">{t('social.sponsor')}</p>
                    <AdSpace className="max-w-2xl mx-auto" slotId="social-impact-banner" />
                </div>
            </section>

        </>
    );
};

const CheckIcon = () => (
    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    </div>
);
