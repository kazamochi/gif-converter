// This service worker exists solely to replace any existing broken service worker.
// It immediately unregisters itself to clean up the client state.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        self.registration.unregister().then(() => {
            return self.clients.matchAll();
        }).then((clients) => {
            clients.forEach((client) => client.navigate(client.url));
        })
    );
});
