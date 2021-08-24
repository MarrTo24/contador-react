//Esto es para que toda la cache cache Storage del navegador nos la provee Service Worker y no el navegador
// ./ es la pagina de inicio de nuestra aplicacion
const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js",
];

const CACHE_NAME = "v3_cache_contador_react"

//const self = this
//Primera parte de un SW se registra, se instala y cacha todas las rutas
//CICLI DE VIDA DE UN SW
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(CACHE_ELEMENTS).then( () => {
                self.skipWaiting();
            })
            .catch(console.log);
        })
    );
});

self.addEventListener("activate", (e) => {
    const cacheWhiteList = [CACHE_NAME];

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                return (
                    cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
                );
            })
          );
        })
         //Reclamar cache
        //Cobra el cache y si es el mismo lo pide y ya en el Network del navegador aparece un engrane con la dirrecion que se esta  introduciendo
        .then(() => self.clients.claim())
    );
});

//Es el que se dispara cada vez que se abre network va a buscar una nueva version de nuestros archivos genera la peticion y responde algo nuevo
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            if(res){
                return res;
            }
            return fetch(e.request);
        })
    );
});
