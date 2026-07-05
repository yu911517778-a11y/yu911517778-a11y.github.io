const CACHE_NAME = "short-drama-studio-v32";
const STATIC_ASSETS = [
  "./",
  "index.html",
  "styles-v031-202607051430.css",
  "styles-v030-202607051245.css",
  "app-v031-202607051430.js",
  "app-v030-202607051430.js",
  "client-entry-v027.html",
  "go.html",
  "client-launch-v031.html",
  "client-access-v031.html",
  "client-access-v030.html",
  "client-open-v031.html",
  "client-open-v030.html",
  "open.html",
  "client-status-v031.html",
  "client-status-v030.html",
  "status.html",
  "client-refresh-v031.html",
  "client-refresh-v030.html",
  "refresh.html",
  "customer-entry-pack-v031.txt",
  "customer-entry-pack-v030.txt",
  "client-lite-v031.html",
  "client-lite-v030.html",
  "client-lite-v027.html",
  "client-access-v029.html",
  "client-open-v029.html",
  "client-status-v029.html",
  "client-refresh-v029.html",
  "customer-entry-pack-v029.txt",
  "client-lite-v026.html",
  "client-lite-v029.html",
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
  "assets/customer-access-qr.svg",
  "assets/palace-night.jpg",
  "assets/social-preview-1200x630.jpg",
  "assets/app-icon-192.png",
  "assets/app-icon-512.png"
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
