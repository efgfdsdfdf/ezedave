const CACHE_NAME = "student-companion-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/signup.html",
  "/home.html",
  "/notes.html",
  "/timetable.html",
  "/gpa.html",
  "/ai.html",
  "/profile.html",
  "/css/styles.css",
  "/js/auth.js",
  "/js/theme.js",
  "/js/gpa.js",
  "/js/ai.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
