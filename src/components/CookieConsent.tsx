import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

export const CookieConsent = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 shadow-2xl">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3 text-sm text-slate-300">
                    <Cookie className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p>
                        {t('cookie.message')}
                        {' '}
                        <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
                            {t('cookie.learnMore')}
                        </Link>
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        {t('cookie.decline')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {t('cookie.accept')}
                    </button>
                </div>
            </div>
        </div>
    );
};
