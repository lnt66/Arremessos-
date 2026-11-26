// Deixa o app instalável e funcionando sem internet (guarda o app e o modelo do corpo no celular).
const APP = 'arremessos-app-v2', MODEL = 'arremessos-modelo-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(APP).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== APP && k !== MODEL).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET') return;
  if (u.origin === location.origin) { e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(APP).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))); return; }
  if (u.hostname === 'cdn.jsdelivr.net' || u.hostname === 'storage.googleapis.com' || u.hostname.endsWith('gstatic.com')) e.respondWith(caches.open(MODEL).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }))));
});
