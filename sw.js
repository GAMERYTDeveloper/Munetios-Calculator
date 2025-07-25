// Define a version for your cache. Change this version to update the cache.
const CACHE_VERSION = 'v1.7.3'; // Incremented version
const CACHE_NAME = `gameryt-calculator-cache-${CACHE_VERSION}`;

// A list of all the essential files your app needs to work offline.
const URLS_TO_CACHE = [
  // The main page, now pointing to app.html inside the /app/ folder
  '/GAMERYT-Calculator/app/app.html',
  '/GAMERYT-Calculator/app/', // Also cache the directory path

  '/GAMERYT-Calculator/404.html',

  // External assets from CDNs
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  // Add paths to any other critical assets like your favicon or icons here
];

// --- EVENT LISTENERS ---

// 1. Install Event: Caches all the essential files.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache', error);
      })
  );
});

// 2. Fetch Event: Intercepts network requests and serves cached files if available.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});

// 3. Activate Event: Cleans up old caches.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
