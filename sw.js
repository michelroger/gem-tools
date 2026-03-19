/* PWA service worker (simples) */
const CACHE_VERSION = 'v1';
const CACHE_NAME = 'gem-tools-' + CACHE_VERSION;

// Arquivos que fazem sentido precachear (single-file app).
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Só trata GET.
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const url = new URL(req.url);

  // Não cacheia requisições cross-origin (ex.: soundfonts/CDN).
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) {
        // Responde do cache; atualiza em background.
        event.waitUntil(
          fetch(req).then(function (res) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(req, copy);
            });
          }).catch(function () {})
        );
        return cached;
      }

      return fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(req, copy);
        });
        return res;
      });
    })
  );
});

