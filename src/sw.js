const staticCacheName = `restaurants-static-v47`;
const contentImgsCache = `restaurants-content-imgs`;
const allCaches = [staticCacheName, contentImgsCache];

console.log(`Started Service Worker: %s`, staticCacheName);

/* Caching skeleton on install */
self.addEventListener(`install`, (event) => {
	const urlsToCache = [
		`/`,
		`/index.html`,
		`/restaurant.html`,
		`/app/dbhelper.js`,
		`/app/main.js`,
		`/app/idb.js`,
		`/app/restaurant_info.js`,
		`/app/restaurants_index.js`,
		`/assets/icons/favicon.ico`,
		`/assets/css/styles.css`,
		`/assets/css/normalize.min.css`,
		`/assets/fonts/MaterialIcons-Regular.woff`,
		`/assets/fonts/MaterialIcons-Regular.woff2`,
		`/assets/fonts/MaterialIcons-Regular.ttf`,
		`/assets/fonts/MaterialIcons-Regular.eot`,
	];
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => cache.addAll(urlsToCache))
	);
});


/*Listen for the message to skipWaiting */
self.addEventListener(`message`, function(event) {
	if (event.data.action === `skipWaiting`) {
		self.skipWaiting();
	}
});
/* Deleting older caches on activate*/
self.addEventListener(`activate`, (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => Promise.all(cacheNames
			.filter((cacheName) => cacheName.startsWith(`restaurants-`) && !allCaches.includes(cacheName))
			.map((cacheName) => caches[`delete`](cacheName))
		))
	);
});

self.addEventListener(`fetch`, (event) => {
	var requestUrl = new URL(event.request.url);

	if (requestUrl.origin === location.origin) {
		if (requestUrl.pathname.startsWith(`/assets/img/`)) {
			event.respondWith(serveImage(event.request));
			return;
		}
		if (requestUrl.pathname.startsWith(`/restaurant.html`)) {
			event.respondWith(caches.match(`/restaurant.html`));
			return;
		}
	}
	/* else if (requestUrl.origin == DATABASE_URL && requestUrl.pathname.startsWith(`/restaurants`)) {
			event.respondWith(serveRestaurant(event.request));
			return;
		}*/
	event.respondWith(
		caches.match(event.request).then((response) => response || fetch(event.request))
	);
});

function serveImage(request) {
	var storageUrl = request.url.replace(/-\d+px\.jpg$/, ``);

	return caches.open(contentImgsCache).then((cache) => cache.match(storageUrl).then((response) => response || fetch(request).then((networkResponse) => {
		cache.put(storageUrl, networkResponse.clone());
		return networkResponse;
	})));
}