let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	fetchRestaurantFromURL().then((restaurant) => {
		self.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 16,
			center: restaurant.latlng,
			scrollwheel: false
		});
		/*fillBreadcrumb();*/
		DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
	}).catch((error) => console.error(error));
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = () => {
	const id = getParameterByName('id');
	const promise = new Promise((resolve, reject) => {
		if (self.restaurant) { // restaurant already fetched!
			reject(self.restaurant);
		} else if (!id) {
			reject('No restaurant id in URL');
		} else {
			DBHelper.fetchRestaurantById(id).then((restaurant) => {
				self.restaurant = restaurant;
				fillRestaurantHTML();
				resolve(restaurant);
			}).catch((error) => reject(error));
		}
	});
	return promise;
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
	const name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	const imageFileName = DBHelper.imageUrlForRestaurant(restaurant).replace(/\.[^/.]+$/, "");
	const imageFileExtension = DBHelper.imageUrlForRestaurant(restaurant).split('.').pop();
	const imageContainer = document.getElementById('img-container');
	imageContainer.innerHTML = `<picture>
			<source media="(max-width: 600px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
					sizes="100vw"></source>
			<source media="(min-width: 600px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
					sizes="50vw"></source>
			<img src="${imageFileName}-800.${imageFileExtension}" alt="${restaurant.name}'s restaurant photo">
		</picture>`;

	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
	const table = document.getElementById('restaurant-hours');
	for (let key in operatingHours) {
		const row = document.createElement('tr');
		row.innerHTML = `<th scope="row">${key}</th><td>${operatingHours[key].replace(/,/g,'<br>')}</td>`;
		table.appendChild(row);
	}
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
	const container = document.getElementById('reviews-list');
	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	reviews.forEach(review => {
		container.appendChild(createReviewHTML(review));
	});
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
	const article = document.createElement('article');
	article.innerHTML = `
		<author>${review.name}</author>
		<time datetime="${review.date}">${review.date}</time>
		<meter max="5" value="${review.rating}" aria-label="Rating ${review.rating} out of 5"></meter>
		<p>${review.comments}</p>`;
	return article;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
/*fillBreadcrumb = (restaurant = self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
}*/

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}