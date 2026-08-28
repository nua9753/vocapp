const CACHE = 'vocab-v55';
// Everything the app needs to boot and run offline, including the vendored
// third-party libraries that used to be CDN-only.
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './lucide.min.js',
  './xlsx.full.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      // One failed file must not abort the whole install.
      await Promise.all(
        CORE_FILES.map(file => c.add(new Request(file, { cache: 'reload' })).catch(() => null))
      );
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

const CACHEABLE_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'cdn.ckeditor.com'];

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (e.request.destination === 'document') {
    // `cache: 'reload'` bypasses the browser HTTP cache. Without it a plain
    // fetch() can be answered from that cache, so a deployed update never
    // reaches the user and the SW happily re-caches the stale page.
    e.respondWith(
      fetch(new Request(e.request, { cache: 'reload' }))
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
        const cacheable = url.origin === self.location.origin || CACHEABLE_HOSTS.includes(url.hostname);
        // Opaque cross-origin responses cannot be validated, so never store them.
        if (r.ok && r.type !== 'opaque' && cacheable) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return r;
      });
    })
  );
});
