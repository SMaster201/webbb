const CACHE_NAME = 'atlas-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/bootstrap.min.css',
    '/css/custom.css',
    '/css/aos.css',
    '/font-awesome-4.7.0/css/font-awesome.min.css',
    '/js/aos.js',
    '/img/logo.webp',
    '/img/logo.png',
    '/img/banner-bk.webp',
    '/img/smart-protect-1.webp',
    '/img/smart-protect-2.webp',
    '/img/smart-protect-3.webp'
];

// 安装Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 拦截请求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
}); 