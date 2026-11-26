// Guarda o app e o modelo do corpo no celular: abre sem internet e avisa quando a análise termina.
const APP = 'arremessos-app-v1', MODEL = 'arremessos-modelo-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(APP).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === location.origin) { // app: tenta a versão nova, senão usa a guardada
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(APP).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
    return;
  }
  if (u.hostname === 'cdn.jsdelivr.net' || u.hostname === 'storage.googleapis.com' || u.hostname.endsWith('gstatic.com') || u.hostname === 'fonts.googleapis.com') { // modelo do corpo e fontes: baixa uma vez
    e.respondWith(caches.open(MODEL).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }))));
  }
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: 'window' }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./'))); });
