const CACHE_NAME = "romaneio-cache-v11";

const FILES_TO_CACHE = [
  "./",
  "./inicio.html",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Instalação — força download de arquivos novos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(
        FILES_TO_CACHE.map(url => new Request(url, { cache: "reload" }))
      );
    })
  );
  self.skipWaiting();
});

// Ativação — remove caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — modo offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).catch(() => caches.match("./inicio.html"));
    })
  );
});
