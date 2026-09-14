// Service worker do izi Freelas.
// Estratégia: navegação é network-first (dados do Supabase precisam estar sempre frescos) com
// fallback para o cache quando offline; assets estáticos do build são cache-first, já que o Next
// gera nomes com hash e nunca reaproveita a mesma URL para conteúdo diferente.

const CACHE_VERSION = "izi-freelas-v1";
const SCOPE = self.registration.scope;
const PRECACHE_URLS = ["", "dashboard", "login", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"].map(
  (path) => new URL(path, SCOPE).toString(),
);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // Um item que falhar não pode impedir a instalação do SW inteiro.
      .then((cache) => Promise.all(PRECACHE_URLS.map((url) => cache.add(url).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return url.pathname.includes("/_next/static/") || url.pathname.includes("/icons/");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Supabase e qualquer outra origem passam direto: nunca servir dado de usuário do cache.
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || Response.error()),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
