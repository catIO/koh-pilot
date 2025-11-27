const CACHE_NAME = 'koh-pilot-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache files individually and handle failures gracefully
        return Promise.allSettled(
          urlsToCache.map((url) => 
            cache.add(url).catch((err) => {
              console.warn(`Failed to cache ${url}:`, err);
            })
          )
        );
      })
      .then(() => {
        // Skip waiting to activate the new service worker immediately
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip caching for non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Try to fetch from network first
        return fetch(event.request)
          .then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse && fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone).catch((err) => {
                  console.warn('Failed to cache response:', err);
                });
              });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback to cached version if network fails
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache and network fails, return a basic response
            return new Response('Offline', { status: 503 });
          });
      })
  );
});