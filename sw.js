// Service worker de ObraCálculo.
// Páginas y archivos propios: primero la red (así siempre ves la última versión) y, sin internet, la copia guardada.
// Librerías externas (three.js): se guardan la primera vez y luego se usan desde la copia.
const CACHE="obracalculo-v1";
const BASE=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const propio=new URL(r.url).origin===location.origin;
  if(propio){
    e.respondWith(fetch(r,{cache:"no-cache"}).then(x=>{const c=x.clone();caches.open(CACHE).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
  }else{
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==="opaque"){const c=x.clone();caches.open(CACHE).then(h=>h.put(r,c))}return x})));
  }
});
