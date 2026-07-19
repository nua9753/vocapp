const CACHE = 'vocab-v41';
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
const OPTIONAL_FILES = ['./lucide.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await c.addAll(CORE_FILES);
      await Promise.all(OPTIONAL_FILES.map(file => c.add(file).catch(() => null)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (!r.ok) return caches.match('./index.html');
          return caches.open(CACHE).then(c => {
            c.put(e.request, r.clone());
            return r;
          });
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        const requestUrl = new URL(e.request.url);
        const cacheableOrigin = requestUrl.origin === self.location.origin || requestUrl.hostname === 'cdn.jsdelivr.net';
        if (r.ok && cacheableOrigin) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      });
    })
  );
});
