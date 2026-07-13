const CACHE_VERSION = "fitness-v132";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=132",
  "./app-fixes.css?v=132",
  "./app.js?v=132",
  "./manifest.json?v=132",
  "./assets/session_light_dos.webp",
  "./assets/session_light_pecs_epaules.webp",
  "./assets/session_light_jambes.webp",
  "./icons/icon_kcal_3d_glass.svg",
  "./icons/icon_poids_3d_glass.svg",
  "./icons/icon_proteines_3d_glass.svg",
  "./icons/app-icon-180.png",
  "./icons/app-icon-192.png",
  "./icons/app-icon-512.png"
];
const D3_CDN = "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js";

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if(request.method !== "GET") return;

  const url = new URL(request.url);

  if(request.mode === "navigate"){
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  if(url.origin === self.location.origin && url.pathname.includes("/programmes/")){
    event.respondWith(
      fetch(request)
        .then(response => {
          if(response.ok){
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if(url.href === D3_CDN){
    event.respondWith(
      caches.match(request).then(cached => {
        const refresh = fetch(request).then(response => {
          if(response.ok || response.type === "opaque"){
            caches.open(CACHE_VERSION).then(cache => cache.put(request, response.clone()));
          }
          return response;
        });
        return cached || refresh;
      }).catch(() => caches.match(request))
    );
    return;
  }

  if(url.origin === self.location.origin){
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        if(response.ok){
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
  }
});
