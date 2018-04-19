let indexDB;
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener(`DOMContentLoaded`, ( /*event*/ ) => {
	_registerServiceWorker();
});
/**
 * Register service worker
 */
function _registerServiceWorker() {
	if (!navigator.serviceWorker) return;

	navigator.serviceWorker.register(`/sw.js`).then((reg) => {
		/* If there isnt controler, page wansn't load via SW. So they are on latest. Exit earlier*/
		if (!navigator.serviceWorker.controller) return;

		/* If there is already waiting, call updateReady*/
		if (reg.waiting) {
			_updateReady(reg.waiting);
			return;
		}

		/* If there is installing, we'll track its state until it becomes installed.*/
		if (reg.installing) {
			_trackInstalling(reg.installing);
			return;
		}
		/* Otherwise, we listen for new installing SW arriving and track it too. */
		reg.addEventListener(`updatefound`, () => {
			_trackInstalling(reg.installing);
		});
	});

	/* Reload page when SW changed */
	let refreshing;
	navigator.serviceWorker.addEventListener(`controllerchange`, () => {
		if (refreshing) return;
		window.location.reload();
		refreshing = true;
	});
}

function _trackInstalling(worker) {
	worker.addEventListener(`statechange`, () => {
		if (worker.state == `installed`)
			_updateReady(worker);
	});
}

function _updateReady(worker) {
	// Show an update is available and ask the user to refresh service worker.
	let updateAvailable = confirm(`New version is available!`);
	if (updateAvailable) {
		worker.postMessage({
			action: `skipWaiting`
		});
	}
}