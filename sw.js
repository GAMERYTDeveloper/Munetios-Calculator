// Define a version for your cache. Change this version to update the cache.
const CACHE_VERSION = 'v1.7.8'; // Incremented version to trigger the update
const CACHE_NAME = `gameryt-calculator-cache-${CACHE_VERSION}`;

// A list of all the essential files your app needs to work offline.
const URLS_TO_CACHE = [
  // The main page, pointing to app.html inside the /app/ folder
  '/GAMERYT-Calculator/index.html',

  // The root of the repository, which redirects to your main page
  '/GAMERYT-Calculator/', 

  '/GAMERYT-Calculator/404.html',

  // External assets from CDNs
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display'
  // Remember to add paths to your icons here if you have them
  '/GAMERYT-Calculator/icon-192x192.png',
];

// --- EVENT LISTENERS ---

// 1. Install Event: Caches all the essential files and activates immediately.
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        // This is the crucial line: it tells the new service worker to activate immediately
        // instead of waiting for all tabs to be closed.
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache during install', error);
      })
  );
});

// Listen for a message from the client to skip waiting (for the update prompt).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 2. Fetch Event: Implements a "Cache first, then network" strategy.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If we have a cached response, return it.
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise, fetch from the network.
      return fetch(event.request);
    })
  );
});

// 3. Activate Event: Cleans up old caches.
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating version ${CACHE_VERSION}...`);
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
  // Take control of all open pages immediately.
  return self.clients.claim();
});
