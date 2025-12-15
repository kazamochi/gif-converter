
import { Heart, Globe, Lightbulb, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';

export const SocialImpact = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
            {/* Header / Mission Statement */}
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
                    { icon: Globe, label: "Global Users", value: "120+", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { icon: Lightbulb, label: "Ideas Realized", value: "50k+", color: "text-amber-400", bg: "bg-amber-500/10" },
                    { icon: GraduationCap, label: "Education Supported", value: "Future", color: "text-emerald-400", bg: "bg-emerald-500/10" },
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
                        Our Commitment
                    </h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            At Toolkit Lab, we operate on a model of <strong>Sustainable Philanthropy</strong>.
                            Revenue generated from advertisements on this platform directly supports:
                        </p>
                        <ul className="grid gap-4 mt-4">
                            {[
                                "Open Source Development & Education",
                                "Server costs for free global access",
                                "Donations to environmental & educational NPOs"
                            ].map((item, i) => (
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
                    <p className="text-center text-xs text-slate-500 mb-2">Sponsored Partners Supporting Our Mission</p>
                    <AdSpace className="max-w-2xl mx-auto" slotId="social-impact-banner" />
                </div>
            </section>

            {/* Call to Action */}
            <section className="text-center space-y-6 pt-8 border-t border-slate-800">
                <h3 className="text-2xl font-semibold text-white">Join our journey</h3>
                <p className="text-slate-400">Simply by using our tools, you are contributing to this ecosystem.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/prompt-pro" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
                        Use Prompt Pro <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/video-converter" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all hover:scale-105">
                        Video Tools <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

const CheckIcon = () => (
    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    </div>
);
