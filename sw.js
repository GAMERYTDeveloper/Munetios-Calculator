// Define a version for your cache. Change this version to update the cache.
const CACHE_VERSION = 'v1.7.0';
const CACHE_NAME = `gameryt-calculator-cache-${CACHE_VERSION}`;

// A list of all the essential files your app needs to work offline.
const URLS_TO_CACHE = [
  // The main page. Adjust if your main file is named differently (e.g., calculator.html)
  '/GAMERYT-Calculator/index.html', 
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
  // waitUntil() ensures that the Service Worker will not install until the code inside has successfully completed.
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
    // caches.match() looks for a match for the current request in the cache.
    caches.match(event.request)
      .then((cachedResponse) => {
        // If a cached response is found, return it.
        if (cachedResponse) {
          console.log('[Service Worker] Returning from cache:', event.request.url);
          return cachedResponse;
        }
        
        // If the request is not in the cache, fetch it from the network.
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request).catch(error => {
            console.error('[Service Worker] Fetch failed; returning offline page instead.', error);
            // If the fetch fails (e.g., user is offline), you can return a fallback offline page.
            // Make sure '/offline.html' is in your URLS_TO_CACHE list.
            // For now, we'll just let the browser's default offline error show.
        });
      })
  );
});

// 3. Activate Event: Cleans up old caches.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // If the cache key is not the current cache name, delete it.
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // Tells the active service worker to take immediate control of all open pages.
  return self.clients.claim();
});
