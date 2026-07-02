const CACHE = 'vocab-v11';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './vocab-icon-192.png',
  './vocab-icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
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
        if (r.ok && new URL(e.request.url).origin === self.location.origin) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      });
    })
  );
});
