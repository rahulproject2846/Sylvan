const CACHE_NAME = 'sylvan-pwa-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Prefetch core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.error('[Service Worker] Pre-cache failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Implement robust 'stale-while-revalidate' strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Only handle http and https schemes (skip chrome-extension, data URIs, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Create the network request promise to revalidate in background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid, cacheable response
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0 || networkResponse.status === 304)) {
              // Clone the response because it's a stream and can only be read once
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((error) => {
            console.warn('[Service Worker] Background fetch failed:', error);
            // Fallback to index.html for page navigation when offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return cachedResponse;
          });

        // Stale-while-revalidate: Return cached response immediately if exists,
        // otherwise wait for the network response.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
