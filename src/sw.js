//This code taken/from WireDelta for help with creating a progressive web app
// application cached when installed 
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('sw-cache').then(function(cache) {
            //Static files cached
            return cache.add('index.html', 'app.js', 'app.css', 'index.css');
        })   
    );
});

//request network 
self.addEventListener('fetch', function(event) {
    event.respondWith(
        //try cache
        caches.match(event.request).then(function(response) {
            //return if response or try again
            return response || fetch(event.request);
        })
    );
});