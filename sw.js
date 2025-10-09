const cacheName = "student-companion-v1";
const assetsToCache = [
  "homepage.html",
  "homepage.css",
  "homepage.js",
  "gpa.html",
  "notes.html",
  "timetable.html",
  "profile.html",
  "ai.html",
  "default-profile.png"
];

// Install SW & cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate SW
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch - serve cached files first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
