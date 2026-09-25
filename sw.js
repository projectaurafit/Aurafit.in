/* ==========================================================
/* ==========================================================
   AURA FIT - SERVICE WORKER
   Cache-first for the app shell so the installed app opens
   instantly and keeps working offline. The wardrobe itself
   lives in localStorage, so offline is genuinely useful.
   Bump CACHE when you ship new assets.
   ========================================================== */
var CACHE = 'aura-fit-classic-v2.0.4-netlify-ready';

var SHELL = [
  './',
  './index.html',
  './admin.html',
  './manifest.webmanifest',
  './vendor/bootstrap.min.css',
  './vendor/bootstrap.bundle.min.js',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './css/screens.css',
  './css/auth.css',
  './css/admin.css',
  './css/admin-mail.css',
  './css/profile-ui.css',
  './css/classic-collections.css',
  './css/classic-items.css',
  './css/classic-account.css',
  './css/classic-shared.css',
  './css/bootstrap-interop.css',
  './js/sprite.js',
  './js/garments.js',
  './js/colour.js',
  './js/illustrations.js',
  './js/data.js',
  './js/api.js',
  './js/store.js',
  './js/ui.js',
  './js/mail-client.js',
  './js/recommend.js',
  './js/pwa.js',
  './js/screens/auth.js',
  './js/screens/onboarding.js',
  './js/screens/home.js',
  './js/screens/wardrobe.js',
  './js/screens/item.js',
  './js/screens/additem.js',
  './js/screens/outfit.js',
  './js/screens/ideas.js',
  './js/screens/account.js',
  './js/screens/stats.js',
  './js/screens/admin.js',
  './js/router.js',
  './js/app.js',
  './js/admin-shell.js',
  './assets/photos/black-tee.jpg',
  './assets/photos/blue-jeans.jpg',
  './assets/photos/casual-trousers.jpg',
  './assets/photos/classic-shirt.jpg',
  './assets/photos/denim-jeans.jpg',
  './assets/photos/flatlay-tee.jpg',
  './assets/photos/graphic-tee.jpg',
  './assets/photos/hanging-jeans.jpg',
  './assets/photos/orange-sneakers.jpg',
  './assets/photos/oxford-shirt.jpg',
  './assets/photos/red-sneakers.jpg',
  './assets/photos/sport-sneakers.jpg',
  './assets/photos/white-sneakers.jpg',
  './assets/photos/white-tee.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        return Promise.all(SHELL.map(function (u) {
          return c.add(u).catch(function () {});
        }));
      })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let network handle cross-origin
  if (url.pathname.indexOf('/api/') === 0) return; // Live API requests never cached

  // Network-first for HTML documents and JavaScript files to guarantee latest code is executed
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js')) {
    e.respondWith(
      fetch(req, { cache: 'no-store' }).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          if (r) return r;
          if (req.mode === 'navigate') {
            return caches.match(url.pathname.endsWith('/admin.html') ? './admin.html' : './index.html');
          }
          return Response.error();
        });
      })
    );
    return;
  }

  // Assets (images, fonts, css): cache with network revalidation
  e.respondWith(
    caches.match(req).then(function (hit) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          return caches.open(CACHE).then(function (c) { return c.put(req, copy); }).then(function () { return res; });
        }
        return res;
      }).catch(function () {
        return hit || Response.error();
      });
      return hit || network;
    })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'skip-waiting') self.skipWaiting();
});
