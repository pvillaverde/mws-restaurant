let restaurants,
	neighborhoods,
	cuisines;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener(`DOMContentLoaded`, (event) => {
	fetchNeighborhoods();
	fetchCuisines();
	updateRestaurants();

});

/**
 * Fetch all neighborhoods and set their HTML.
 */
function fetchNeighborhoods() {
	DBHelper.fetchNeighborhoods().then((neighborhoods) => {
		self.neighborhoods = neighborhoods;
		fillNeighborhoodsHTML();
	}).catch((error) => console.error(error));
}

/**
 * Set neighborhoods HTML.
 */
function fillNeighborhoodsHTML(neighborhoods = self.neighborhoods) {
	const select = document.getElementById(`neighborhoods-select`);
	neighborhoods.forEach(neighborhood => {
		const option = document.createElement(`option`);
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
}

/**
 * Fetch all cuisines and set their HTML.
 */
function fetchCuisines() {
	DBHelper.fetchCuisines().then((cuisines) => {
		self.cuisines = cuisines;
		fillCuisinesHTML();
	}).catch((error) => console.error(error));
}

/**
 * Set cuisines HTML.
 */
function fillCuisinesHTML(cuisines = self.cuisines) {
	const select = document.getElementById(`cuisines-select`);

	cuisines.forEach(cuisine => {
		const option = document.createElement(`option`);
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
	self.map = new google.maps.Map(document.getElementById(`map`), {
		zoom: 12,
		center: loc,
	});
	addMarkersToMap();
	/* Set alt attributes on maps images so they dont get readed by screenReaders */
	google.maps.event.addListener(self.map, `tilesloaded`, function(evt) {
		var noAltImages = [].slice.call(document.querySelectorAll(`img:not([alt])`));
		noAltImages.forEach(img => {
			if (!img.alt) img.alt = ``;
		});
	});
};

/**
 * Update page and map for current restaurants.
 */
function updateRestaurants() {
	const cSelect = document.getElementById(`cuisines-select`);
	const nSelect = document.getElementById(`neighborhoods-select`);

	const cIndex = cSelect.selectedIndex;
	const nIndex = nSelect.selectedIndex;

	const cuisine = cSelect[cIndex].value;
	const neighborhood = nSelect[nIndex].value;

	DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood).then((restaurants) => {
		resetRestaurants(restaurants);
		fillRestaurantsHTML();
	}).catch((error) => console.error(error));

}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
function resetRestaurants(restaurants) {
	// Remove all restaurants
	self.restaurants = [];
	const ul = document.getElementById(`restaurants-list`);
	ul.innerHTML = ``;

	// Remove all map markers
	self.markers.forEach(m => m.setMap(null));
	self.markers = [];
	self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
function fillRestaurantsHTML(restaurants = self.restaurants) {
	const ul = document.getElementById(`restaurants-list`);
	let promises = [];
	restaurants.forEach(restaurant => {
		promises.push(getRestaurantRating(restaurant).then(rating => {
			restaurant.rating = rating;
			ul.append(createRestaurantHTML(restaurant));
		}));
		//ul.append(createRestaurantHTML(restaurant));
	});
	Promise.all(promises).then(() => {
		addMarkersToMap();
		enableLazyLoading();
	});
}

/**
 * Create restaurant HTML.
 */
function createRestaurantHTML(restaurant) {
	const is_favorite = restaurant.is_favorite == `true` ? `<span title="Favorite" style="position:absolute;color:yellow;font-size:30px;">⭐ </span>` : ``;
	//restaurant.rating = getRestaurantRating(restaurant);
	const imageFileName = DBHelper.imageUrlForRestaurant(restaurant).replace(/\.[^/.]+$/, ``);
	const li = document.createElement(`li`);
	li.innerHTML = `
	<a href="${DBHelper.urlForRestaurant(restaurant)}" aria-label="${restaurant.name}">
		<figure>${is_favorite}
			<picture>
				<source class="lazy"  media="(max-width: 600px)"  data-srcset="${imageFileName}-400.webp 400w, ${imageFileName}-800.webp 800w" sizes="100vw"></source>
				<source class="lazy"  media="(max-width: 960px)"  data-srcset="${imageFileName}-400.webp 400w, ${imageFileName}-800.webp 800w" sizes="50vw"></source>
				<source class="lazy"  media="(min-width: 960px)"  data-srcset="${imageFileName}-400.webp 400w, ${imageFileName}-800.webp 800w" sizes="360px"></source>
				<source class="lazy"  media="(max-width: 600px)"  data-srcset="${imageFileName}-400.jpg 400w, ${imageFileName}-800.jpg 800w" sizes="100vw"></source>
				<source class="lazy"  media="(max-width: 960px)"  data-srcset="${imageFileName}-400.jpg 400w, ${imageFileName}-800.jpg 800w"	sizes="50vw"></source>
				<source class="lazy"  media="(min-width: 960px)"  data-srcset="${imageFileName}-400.jpg 400w, ${imageFileName}-800.jpg 800w"	sizes="360px"></source>
				<img class="lazy" src="assets/img/placeholder-image-400.webp" data-src="${imageFileName}-800.jpg" alt="${restaurant.name}'s restaurant photo">
			</picture>
			<figcaption>
				<h1>${restaurant.name} <span class="pull-right rating"><i class="material-icons" aria-label="Average rating">favorite</i>${restaurant.rating}</span></h1>
				<p>
					<span><i class="material-icons" aria-label="Cuisine Type">restaurant_menu</i>${restaurant.cuisine_type}</span>
					<span class="pull-right"><i class="material-icons" aria-label="Neighborhood">location_on</i>${restaurant.neighborhood}</span>
				</p>
			</figcaption>
		</figure>
	</a>`;

	return li;
}
/*
 * Get rating average for restaurant from its reviews
 */
function getRestaurantRating(restaurant) {
	return DBHelper.fetchReviews(restaurant.id).then(reviews => {
		var sum = reviews.reduce((total, review) => total + parseInt(review.rating), 0) * 10;
		return Math.round(sum / reviews.length, 1) / 10;
	});
}

/**
 * Add markers for current restaurants to the map.
 */
function addMarkersToMap(restaurants = self.restaurants) {
	if (!self.map || !restaurants) return;
	restaurants.forEach(restaurant => {
		// Add marker to the map
		const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
		google.maps.event.addListener(marker, `click`, () => {
			window.location.href = marker.url;
		});
		self.markers.push(marker);
	});
}
/**
 * Add markers for current restaurants to the map.
 */
function enableLazyLoading() {
	var lazyImages = [].slice.call(document.querySelectorAll(`.lazy`));
	if (`IntersectionObserver` in window) {
		let lazyImageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					let lazyImage = entry.target;
					lazyImage.src = lazyImage.dataset.src;
					lazyImage.srcset = lazyImage.dataset.srcset;
					lazyImage.classList.remove(`lazy`);
					lazyImageObserver.unobserve(lazyImage);
				}
			});
		});
		lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));
	} else {
		// Possibly fall back to a more compatible method here
	}
}