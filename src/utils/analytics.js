// Mixpanel can't load on server, so we need to do a check to make sure we're on the browser
// Google analytics could load server side, but let's stay consistent

let ga = undefined;
let mixpanel = undefined;
if (typeof window !== 'undefined') {
	ga = require('react-ga');
	mixpanel = require('mixpanel-browser');
}

function pageView(path, loggedIn) {
	ga.pageview(path);
	mixpanel.track('Page Viewed', {
		'path': path,
		'loggedIn': loggedIn
	});
}

function sendEvent(eventData) {
	// Do things
}

export default {
	pageView,
	sendEvent,
};
