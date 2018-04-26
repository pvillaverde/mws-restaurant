let restaurant;
var map;

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener(`DOMContentLoaded`, ( /*event*/ ) => {
	fetchRestaurantFromURL();
});
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	fetchRestaurantFromURL().then((restaurant) => {
		self.map = new google.maps.Map(document.getElementById(`map`), {
			zoom: 16,
			center: restaurant.latlng,
			scrollwheel: false
		});
		DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
	}).catch((error) => console.error(error));
};

/**
 * Get current restaurant from page URL.
 */
function fetchRestaurantFromURL() {
	const id = getParameterByName(`id`);
	const promise = new Promise((resolve, reject) => {
		if (self.restaurant) { // restaurant already fetched!
			resolve(self.restaurant);
		} else if (!id) {
			reject(`No restaurant id in URL`);
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
function fillRestaurantHTML(restaurant = self.restaurant) {
	const name = document.getElementById(`restaurant-name`);
	if (name.innerHTML != ``) return;
	name.innerHTML = restaurant.name;

	const address = document.getElementById(`restaurant-address`);
	address.innerHTML = restaurant.address;

	const imageFileName = DBHelper.imageUrlForRestaurant(restaurant).replace(/\.[^/.]+$/, ``);
	/*const imageFileExtension = DBHelper.imageUrlForRestaurant(restaurant).split(`.`).pop();*/
	const imageFileExtension = `jpg`;
	const imageContainer = document.getElementById(`img-container`);
	imageContainer.innerHTML = `<picture>
			<source media="(max-width: 600px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
					sizes="100vw"></source>
			<source media="(min-width: 600px)" srcset="${imageFileName}-400.${imageFileExtension} 400w, ${imageFileName}-800.${imageFileExtension} 800w"
					sizes="50vw"></source>
			<img src="${imageFileName}-800.${imageFileExtension}" alt="${restaurant.name}'s restaurant photo">
		</picture>`;

	const cuisine = document.getElementById(`restaurant-cuisine`);
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
function fillRestaurantHoursHTML(operatingHours = self.restaurant.operating_hours) {
	const table = document.getElementById(`restaurant-hours`);
	for (let key in operatingHours) {
		const row = document.createElement(`tr`);
		row.innerHTML = `<th scope="row">${key}</th><td>${operatingHours[key].replace(/,/g,`<br>`)}</td>`;
		table.appendChild(row);
	}
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
function fillReviewsHTML(reviews = self.restaurant.reviews) {
	const container = document.getElementById(`reviews-list`);
	if (!reviews) {
		const noReviews = document.createElement(`p`);
		noReviews.innerHTML = `No reviews yet!`;
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
function createReviewHTML(review) {
	const article = document.createElement(`article`);
	article.innerHTML = `
		<author>${review.name}</author>
		<time datetime="${review.date}">${review.date}</time>
		<meter class="meter-5-hearth" max="5" value="${review.rating}"></meter>
		<span role="presentation" aria-label="Rating ${review.rating} out of 5" data-value="${review.rating}"></span>
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
function getParameterByName(name, url) {
	if (!url)
		url = window.location.href;
	name = name.replace(/[[]]/g, `\\$&`);
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return ``;
	return decodeURIComponent(results[2].replace(/\+/g, ` `));
}