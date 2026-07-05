const CACHE_NAME = "short-drama-studio-v24";
const STATIC_ASSETS = [
  "./",
  "index.html",
  "styles-v024.css",
  "app-v024.js",
  "favicon.svg",
  "manifest.webmanifest",
  "assets/palace-night.webp",
  "assets/hanfu-lantern.webp",
  "assets/pavilion-day.webp",
  "assets/lantern-face.webp",
  "assets/clapper-close.webp",
  "assets/slate-table.webp",
  "assets/city-motion.webp",
  "assets/film-set.webp",
  "assets/film-studio.webp",
  "assets/customer-entry-qr.svg",
  "assets/palace-night.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.pathname.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./")))
  );
});
