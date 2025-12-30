// This script allows the app to be installable
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (e) => {
  // This helps the app load faster
  e.respondWith(fetch(e.request));
});