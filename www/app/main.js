let restaurants,
	neighborhoods,
	cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
	fetchNeighborhoods();
	fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
	DBHelper.fetchNeighborhoods((error, neighborhoods) => {
		if (error) { // Got an error
			console.error(error);
		} else {
			self.neighborhoods = neighborhoods;
			fillNeighborhoodsHTML();
		}
	});
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
	const select = document.getElementById('neighborhoods-select');
	neighborhoods.forEach(neighborhood => {
		const option = document.createElement('option');
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
	DBHelper.fetchCuisines((error, cuisines) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.cuisines = cuisines;
			fillCuisinesHTML();
		}
	});
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
	const select = document.getElementById('cuisines-select');

	cuisines.forEach(cuisine => {
		const option = document.createElement('option');
		option.innerHTML = cuisine;
		option.value = cuisine;
		select.append(option);
	});
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	let loc = {
		lat: 40.722216,
		lng: -73.987501
	};
	self.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: loc,
	});
	updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
	const cSelect = document.getElementById('cuisines-select');
	const nSelect = document.getElementById('neighborhoods-select');

	const cIndex = cSelect.selectedIndex;
	const nIndex = nSelect.selectedIndex;

	const cuisine = cSelect[cIndex].value;
	const neighborhood = nSelect[nIndex].value;

	DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			resetRestaurants(restaurants);
			fillRestaurantsHTML();
		}
	})
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
	// Remove all restaurants
	self.restaurants = [];
	const ul = document.getElementById('restaurants-list');
	ul.innerHTML = '';

	// Remove all map markers
	self.markers.forEach(m => m.setMap(null));
	self.markers = [];
	self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
	const ul = document.getElementById('restaurants-list');
	restaurants.forEach(restaurant => {
		ul.append(createRestaurantHTML(restaurant));
	});
	addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
	restaurant.rating = getRestaurantRating(restaurant);
	const imageFileName = DBHelper.imageUrlForRestaurant(restaurant).replace(/\.[^/.]+$/, "");
	const imageFileExtension = DBHelper.imageUrlForRestaurant(restaurant).split('.').pop();
	const li = document.createElement('li');
	li.innerHTML = `
		<a href="${DBHelper.urlForRestaurant(restaurant)}" aria-label="Check operating hours and reviews">
			<figure>
				<picture>
					<source media="(max-width: 600px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
							sizes="100vw"></source>
					<source media="(max-width: 960px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
							sizes="50vw"></source>
					<source media="(min-width: 960px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
							sizes="360px"></source>
					<img src="${imageFileName}-800.${imageFileExtension}" alt="${restaurant.name}'s restaurant photo">
				</picture>
				<figcaption>
					<h1>${restaurant.name} <span class="pull-right icon ion-android-favorite" aria-label="Average rating">${restaurant.rating}</span></h1>
					<p>
						<span class="icon ion-android-restaurant" aria-label="Cuisine Type">${restaurant.cuisine_type}</span>
						<span class="icon ion-location pull-right" aria-label="Neighborhood">${restaurant.neighborhood}</span>
					</p>
				</figcaption>
			</figure>
		</a>`;

	return li
}
/*
 * Get rating average for restaurant from its reviews
 */
getRestaurantRating = (restaurant) => {
	var sum = restaurant.reviews.reduce((total, review) => total + review.rating, 0) * 10;
	return Math.round(sum / restaurant.reviews.length, 1) / 10;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
	restaurants.forEach(restaurant => {
		// Add marker to the map
		const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
		google.maps.event.addListener(marker, 'click', () => {
			window.location.href = marker.url
		});
		self.markers.push(marker);
	});
}