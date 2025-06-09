const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
  '/',
  '/todo-list-app/',
  '/todo-list-app/index.html',
  '/todo-list-app/styles.css',
  '/todo-list-app/app.js',
  '/todo-list-app/icons/icon-192x192.png',
  '/todo-list-app/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});


