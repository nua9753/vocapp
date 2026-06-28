const CACHE = 'vocab-v3';
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // HTML: network first (always check for updates)
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(r => r.ok ? caches.open(CACHE).then(c => { c.put(e.request, r.clone()); return r; }) : caches.match(e.request))
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
  } else {
    // Other assets: cache first
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
    );
  }
});
