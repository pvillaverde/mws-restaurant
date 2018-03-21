/**
 * Common database helper functions.
 */
class DBHelper {

	/**
	 * Database URL.
	 * Change this to restaurants.json file location on your server.
	 */
	static get DATABASE_URL() {
		const port = 8000 // Change this to your server port
		/*return `http://localhost:${port}/data/restaurants.json`;*/
		return `/data/restaurants.json`;
	}

	/**
	 * Fetch all restaurants.
	 */
	static fetchRestaurants() {
		/*const promise = new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', DBHelper.DATABASE_URL);
			xhr.onload = () => {
				if (xhr.status === 200) { // Got a success response from server!
					const json = JSON.parse(xhr.responseText);
					const restaurants = json.restaurants;
					resolve(restaurants);
				} else { // Oops!. Got an error from server.
					const error = (`Request failed. Returned status of ${xhr.status}`);
					reject(error);
				}
			};
			xhr.send();
		});
		return promise;*/

		/* NOT WORKING ON python SimpleHTTPServer. It does work with npm http-server */
		return fetch(DBHelper.DATABASE_URL)
			.then((response) => response.json())
			.then((json) => json.restaurants);
	}

	/**
	 * Fetch a restaurant by its ID.
	 */
	static fetchRestaurantById(id) {
		// fetch all restaurants with proper error handling.
		return DBHelper.fetchRestaurants().then((restaurants) => {
			const restaurant = restaurants.find(r => r.id == id);
			if (restaurant) { // Got the restaurant
				return restaurant;
			} else { // Restaurant does not exist in the database
				throw 'Restaurant does not exist';
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	static fetchRestaurantByCuisine(cuisine) {
		// Fetch all restaurants  with proper error handling
		return DBHelper.fetchRestaurants().then((restaurants) => {
			// Filter restaurants to have only given cuisine type
			const results = restaurants.filter(r => r.cuisine_type == cuisine);
			return results;
		});
	}

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	static fetchRestaurantByNeighborhood(neighborhood) {
		// Fetch all restaurants
		return DBHelper.fetchRestaurants().then((restaurants) => {
			// Filter restaurants to have only given neighborhood
			const results = restaurants.filter(r => r.neighborhood == neighborhood);
			return results;
		});
	}

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
		// Fetch all restaurants
		return DBHelper.fetchRestaurants().then((restaurants) => {
			let results = restaurants
			if (cuisine != 'all') { // filter by cuisine
				results = results.filter(r => r.cuisine_type == cuisine);
			}
			if (neighborhood != 'all') { // filter by neighborhood
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
			const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
			// Remove duplicates from neighborhoods
			const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
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
			const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
			// Remove duplicates from cuisines
			const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
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
		return (`/assets/img/${restaurant.photograph}`);
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