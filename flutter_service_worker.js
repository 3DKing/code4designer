'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/asset/badges/badge-01.png": "d1b79510b04d5f01925e867978b031a1",
"assets/asset/badges/badge-02.png": "c49a4613fdc9335002d55bb17a64d5f6",
"assets/asset/badges/badge-03.png": "de4ae7ca312e29ec8cc0179f8b9a90a9",
"assets/asset/badges/badge-04.png": "af2d841a51a1a8f1e9aef7944716de47",
"assets/asset/certificates/certificate-01.png": "9017570e955f193a3057918a4f0d76c1",
"assets/asset/certificates/certificate-02.png": "fe300442886036cdee5bfa9993133b12",
"assets/asset/certificates/certificate-03.png": "85d859c5632526b70834dbcd56dbfa99",
"assets/asset/fonts/SFProText-Bold.ttf": "d6079ef01292c4bc84dce33988641530",
"assets/asset/fonts/SFProText-Regular.ttf": "85bd46c1cff02c1d8360cc714b8298fa",
"assets/asset/icons/icon-logout.png": "4fab599d07b525c51484ab24baed58e8",
"assets/asset/icons/icon-play.png": "5e09339dab6a0b732416a1354d15bf14",
"assets/asset/icons/icon-sidebar.png": "518b0727b1f268f7b53cb1f3eac97ab9",
"assets/asset/illustrations/illustration-01.png": "2165e2ff93f16394c11d43d3230fb442",
"assets/asset/illustrations/illustration-02.png": "7c3653d91e7ab6e7bc4c8fc489729372",
"assets/asset/illustrations/illustration-03.png": "88e7174009ce75aa1fd1a37ceeef83a0",
"assets/asset/illustrations/illustration-04.png": "3413de0a1af5a38628207b9b25831a2b",
"assets/asset/illustrations/illustration-05.png": "b061dfba02d35c9a7016b9445158200c",
"assets/asset/illustrations/illustration-06.png": "78b0a769e5958371e164b6ff20ac55cb",
"assets/asset/illustrations/illustration-07.png": "f75a95aa3faf11f04a1c4e6f3daadd5d",
"assets/asset/illustrations/illustration-08.png": "78004a29e4f534a33a8cffe7c13cfed4",
"assets/asset/illustrations/illustration-09.png": "396cd670b823e31e1d8275b801fd5089",
"assets/asset/illustrations/illustration-10.png": "fc24bb166d249fffa74fba75cb681527",
"assets/asset/illustrations/illustration-11.png": "835e2d76b0caaf3f592544e7db10f528",
"assets/asset/illustrations/illustration-12.png": "7f916c20a60d5fd5af2e8cd1a4572d85",
"assets/asset/illustrations/illustration-13.png": "44f99fba0e03c20d5ab9f78dedca7bc3",
"assets/asset/images/profile.jpg": "c625ad74133d8c857f2d6d0b153900ed",
"assets/asset/logos/flutter-logo.png": "75c49be7e3abb965cc24902dee6242d9",
"assets/asset/logos/protopie-logo.png": "5eab80d68de18843fdb4464b31d2870b",
"assets/asset/logos/swift-logo.png": "08b3753709d6afb00482c937e89b89bf",
"assets/AssetManifest.json": "7f643aac375cb19406d1c13ebb77abae",
"assets/FontManifest.json": "9c183022d11cd506f7fd9bfcc0564333",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "ee6c9da211266b650cf806268fbb6eae",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "2ad5fabd6a36a6deff087b8edfd0c1f8",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "8ae00b472ec3937a5bee52055d6bc8b4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "a2e6fba85e0704735c9ab8c1ac58b32c",
"/": "a2e6fba85e0704735c9ab8c1ac58b32c",
"main.dart.js": "4d28209ae505429ecbcdbcaec1a6f18c",
"manifest.json": "d8ad8848fa6746a6c9c848660a36a7d6",
"version.json": "07d247be1e8af887245e01809a819247"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
