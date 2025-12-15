
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const initGA = () => {
    const gaId = import.meta.env.VITE_GA_ID;

    // Only run in production and if ID is present
    if (import.meta.env.PROD && gaId) {
        // Inject script tag
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        // Config
        window.gtag('js', new Date());
        window.gtag('config', gaId);

        console.log('GA4 initialized');
    } else {
        console.log('GA4 skipped (Development or No ID)');
    }
};
