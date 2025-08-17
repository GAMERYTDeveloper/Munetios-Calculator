// Define a version for your cache. Change this version to update the cache.
const CACHE_VERSION = 'v1.7.9'; // Bumped version
const CACHE_NAME = `gameryt-calculator-cache-${CACHE_VERSION}`;

// A list of all the essential files your app needs to work offline.
const URLS_TO_CACHE = [
  // App shell
  '/GAMERYT-Calculator/index.html',
  '/GAMERYT-Calculator/',
  '/GAMERYT-Calculator/404.html',
  '/GAMERYT-Calculator/icon-192x192.png',

  // ✅ External assets (must use full URLs and valid endpoints)
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  // ⚠️ Removed `https://cdn.tailwindcss.com` → cannot be cached
];

// --- EVENT LISTENERS ---

// 1. Install Event
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('[Service Worker] Failed to cache during install', error);
      })
  );
});

// 2. Message Event
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 3. Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// 4. Activate Event
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating version ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});
