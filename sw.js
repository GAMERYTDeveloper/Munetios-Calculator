// Always bump version to trigger update
const CACHE_VERSION = 'v1.8.2';
const CACHE_NAME = `gameryt-calculator-cache-${CACHE_VERSION}`;

const URLS_TO_CACHE = [
  '/',               // root
  '/index.html',
  '/404.html',
  '/favicon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',

  // Fonts
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// --- INSTALL ---
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())   // ✅ Immediately replace old SW
  );
});

// --- ACTIVATE ---
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  return self.clients.claim(); // ✅ Take control instantly
});

// --- FETCH ---
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Offline-first: serve index.html if offline
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    // Cache-first for assets
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
