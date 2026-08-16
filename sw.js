// Service Worker for PWA — offline-first
const CACHE_NAME = 'scoreboard-v5';
const scopeUrl = new URL('./', self.location);
const PRECACHE_URLS = [
  scopeUrl.href,
  new URL('./index.html', self.location).href,
  new URL('./new-game.html', self.location).href,
  new URL('./game.html', self.location).href,
  new URL('./history.html', self.location).href,
  new URL('./manifest.json', self.location).href,
  new URL('./version.json', self.location).href,
  new URL('./icon-192.png', self.location).href,
  new URL('./icon-512.png', self.location).href,
  new URL('./favicon.ico', self.location).href
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache-first, refresh-in-background: the app must work with zero
// connectivity, so a cached response always wins immediately; the network
// is only used to silently refresh the cache for next time.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match(new URL('./index.html', self.location).href));

      return cached || networkFetch;
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
