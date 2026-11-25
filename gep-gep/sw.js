/* Gep Gep — çevrimdışı önbellek
   Uygulama dosyaları: önce ağ, yoksa önbellek.
   Vikipedi fotoğrafları ve harita karoları: önce önbellek (internetsiz rotalar için). */
const C = 'gepgep-v28';
const CORE = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-180.png', 'css/app.css',
  'js/config.js', 'js/galata.js', 'js/core.js', 'js/paylas.js', 'js/kamera.js', 'js/gezi.js', 'js/gokyuzu.js', 'js/alisveris.js', 'js/gunluk.js', 'js/acilis.js', 'js/tema.js', 'icon-512.png',
  'vendor/maplibre-gl.js', 'vendor/maplibre-gl.css', 'vendor/astronomy.browser.min.js'];

self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C && x !== 'gepgep-img').map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // Gemini gibi POST istekleri önbelleğe girmez
  const url = new URL(req.url);
  const imageLike = /upload\.wikimedia\.org|basemaps\.cartocdn\.com/.test(url.host);
  if (imageLike) {
    e.respondWith(caches.open('gepgep-img').then(c => c.match(req).then(hit => hit || fetch(req).then(r => { c.put(req, r.clone()).catch(()=>{}); return r; }))));
    return;
  }
  e.respondWith(fetch(req).then(r => {
    if (r.ok && (url.origin === location.origin || /wikipedia\.org/.test(url.host))) {
      const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)).catch(()=>{});
    }
    return r;
  }).catch(() => caches.match(req)));
});
