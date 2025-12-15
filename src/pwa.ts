// Register Service Worker
export const registerSW = () => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(
                (registration) => {
                    console.log('SW registered: ', registration);
                },
                (registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                }
            );
        });
    }
};
