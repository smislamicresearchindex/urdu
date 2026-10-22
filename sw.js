/* SM Islamic Research Index — service worker.
   Network-first: every online launch gets the newest files from the site; offline uses the last copy.
   This file never needs editing when you update the app or the data. */
var C='smiri-cache';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('message',function(e){if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',function(e){
  var rq=e.request;
  if(rq.method!=='GET')return;
  var same=new URL(rq.url).origin===self.location.origin;
  e.respondWith((same?fetch(rq,{cache:'no-cache'}):fetch(rq)).then(function(r){
    if(r&&r.ok){var c=r.clone();caches.open(C).then(function(ch){ch.put(rq,c);}).catch(function(){});}
    return r;
  }).catch(function(){return caches.match(rq).then(function(m){return m||caches.match('./');});}));
});
