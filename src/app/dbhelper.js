/**
 * Common database helper functions.
 */
class DBHelper {
	/**
	 * Database URL.
	 * Change this to restaurants.json file location on your server.
	 */
	static get DATABASE_URL() {
		const port = 1337; // Change this to your server port
		return `http://localhost:${port}`;
		/*return `/data/restaurants.json`;*/
	}

	/* Open IndexDB Database*/
	static openDatabase() {
		// If the browser doesn't support service worker,
		// we don't care about having a database
		if (!navigator.serviceWorker) {
			return Promise.resolve();
		}

		return idb.open(`review-restaurants`, 2, (upgradeDB) => {
			switch (upgradeDB.oldVersion) {
				case 0:
					{
						const restaurantsStore = upgradeDB.createObjectStore(`restaurants`, {
							keyPath: `id`
						});
						restaurantsStore.createIndex(`by-cuisine`, `cuisine_type`);
						restaurantsStore.createIndex(`by-neighborhood`, `neighborhood`);
					}
					// break omitted
				case 1:
					{
						const reviewsStore = upgradeDB.createObjectStore(`reviews`, {
							keyPath: `id`
						});
						reviewsStore.createIndex(`by-restaurant`, `restaurant_id`);
					}
			}
		});

	}

	/**
	 * Fetch all restaurants.
	 */
	static fetchRestaurants() {
		return DBHelper.getRestaurantsFromLocal().then(restaurants => {
			if (restaurants && restaurants.length) {
				DBHelper.getRestaurantsFromRemote();
				return restaurants;
			} else {
				return DBHelper.getRestaurantsFromRemote();
			}
		});
	}

	static getRestaurantsFromLocal() {
		return DBHelper.openDatabase().then((db) => {
			if (!db) return;
			return db.transaction(`restaurants`).objectStore(`restaurants`).getAll();
		});
	}

	static getRestaurantsFromRemote() {
		return fetch(`${DBHelper.DATABASE_URL}/restaurants`)
			.then(response => response.json())
			.then(restaurants => {
				DBHelper.addRestaurantsToIndexDB(restaurants);
				return restaurants;
			});
	}
	static toggleFavoriteRestaurant(restaurant) {
		return fetch(`${DBHelper.DATABASE_URL}/restaurants/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`, {
				method: `PUT`
			})
			.then(response => response.json())
			.then(restaurant => {
				DBHelper.addRestaurantsToIndexDB([restaurant]);
				return restaurant;
			});
	}


	static addRestaurantsToIndexDB(restaurants) {
		return DBHelper.openDatabase().then((db) => {
			if (!db) return;

			const tx = db.transaction(`restaurants`, `readwrite`);
			const store = tx.objectStore(`restaurants`);
			restaurants.forEach(restaurant => store.put(restaurant));
			return tx.complete;
		});
	}

	/**
	 * Fetch all reviews.
	 */
	static fetchReviews(restaurant) {
		return DBHelper.getReviewsFromLocal(restaurant).then(reviews => {
			if (reviews && reviews.length) {
				DBHelper.getReviewsFromRemote(restaurant);
				return reviews;
			} else {
				return DBHelper.getReviewsFromRemote(restaurant);
			}
		});
	}
	static getReviewsFromLocal(restaurant) {
		return DBHelper.openDatabase().then((db) => {
			if (!db) return;

			return db.transaction(`reviews`).objectStore(`reviews`).index(`by-restaurant`).getAll(restaurant);
		});
	}

	static getReviewsFromRemote(restaurant) {
		return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${restaurant}`)
			.then(response => response.json())
			.then(reviews => {
				DBHelper.addReviewsToIndexDB(reviews);
				return reviews;
			});
	}
	static addNewReview(review) {
		return fetch(`${DBHelper.DATABASE_URL}/reviews`, {
				method: `POST`,
				body: JSON.stringify(review)
			})
			.then(response => response.json())
			.then(review => {
				DBHelper.addReviewsToIndexDB([review]);
				return review;
			});
	}
	static addReviewsToIndexDB(reviews) {
		return DBHelper.openDatabase().then((db) => {
			if (!db) return;

			const tx = db.transaction(`reviews`, `readwrite`);
			const store = tx.objectStore(`reviews`);
			reviews.forEach(review => store.put(review));
			return tx.complete;
		});
	}

	/**
	 * Fetch a restaurant by its ID.
	 */
	static fetchRestaurantById(id) {
		return DBHelper.openDatabase().then((db) => {
			if (!db) return;
			//parseInt because id are stored as integers on database
			return db.transaction(`restaurants`).objectStore(`restaurants`).get(parseInt(id));
		}).then(restaurant => {
			return restaurant || fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}`)
				.then(response => response.json());
		});
	}
	/*static deleteRestaurantsFromIndexDB() {
		return DBHelper.openDatabase().then((db) => {
			if (!db) return;

			const tx = db.transaction(`restaurants`, `readwrite`);
			const store = tx.objectStore(`restaurants`);
			store.openCursor(null, `prev`)
				.then(function(cursor) {
					return cursor.advance(30);
				})
				.then(function deleteRest(cursor) {
					if (!cursor) return;
					cursor.delete();
					return cursor.continue().then(deleteRest);
				});
			return tx.complete;
		});
	}*/
	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	static fetchRestaurantByCuisine(cuisine) {
		// Fetch all restaurants  with proper error handling
		return DBHelper.fetchRestaurants()
			// Filter restaurants to have only given cuisine type
			.then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))
			.catch(() => DBHelper.openDatabase().then((db) => {
				if (!db) return;

				return db.transaction(`restaurants`).objectStore(`restaurants`).index(`by-cuisine`).getAll(cuisine);
			}));
	}

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	static fetchRestaurantByNeighborhood(neighborhood) {
		// Fetch all restaurants
		return DBHelper.fetchRestaurants()
			// Filter restaurants to have only given neighborhood
			.then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))
			.catch(() => DBHelper.openDatabase().then((db) => {
				if (!db) return;

				return db.transaction(`restaurants`).objectStore(`restaurants`).index(`by-neighborhood`);
			}));
	}

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
		// Fetch all restaurants
		return DBHelper.fetchRestaurants().then((restaurants) => {
			let results = restaurants;
			if (cuisine != `all`) { // filter by cuisine
				results = results.filter(r => r.cuisine_type == cuisine);
			}
			if (neighborhood != `all`) { // filter by neighborhood
				results = results.filter(r => r.neighborhood == neighborhood);
			}
			return results;
		});
	}

	/**
	 * Fetch all neighborhoods with proper error handling.
	 */
	static fetchNeighborhoods() {
		// Fetch all restaurants
		return DBHelper.fetchRestaurants().then((restaurants) => {
			// Get all neighborhoods from all restaurants
			const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
			// Remove duplicates from neighborhoods
			const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
			return uniqueNeighborhoods;
		});
	}

	/**
	 * Fetch all cuisines with proper error handling.
	 */
	static fetchCuisines() {
		// Fetch all restaurants
		return DBHelper.fetchRestaurants().then((restaurants) => {
			// Get all cuisines from all restaurants
			const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
			// Remove duplicates from cuisines
			const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
			return uniqueCuisines;
		});
	}

	/**
	 * Restaurant page URL.
	 */
	static urlForRestaurant(restaurant) {
		return (`./restaurant.html?id=${restaurant.id}`);
	}

	/**
	 * Restaurant image URL.
	 */
	static imageUrlForRestaurant(restaurant) {
		return (`/assets/img/${restaurant.photograph ? restaurant.photograph  : `placeholder-image.webp`}`);
	}

	/**
	 * Map marker for a restaurant.
	 */
	static mapMarkerForRestaurant(restaurant, map) {
		const marker = new google.maps.Marker({
			position: restaurant.latlng,
			title: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant),
			map: map,
			animation: google.maps.Animation.DROP
		});
		return marker;
	}

}