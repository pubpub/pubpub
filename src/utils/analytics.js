// Mixpanel can't load on server, so we need to do a check to make sure we're on the browser
// Google analytics could load server side, but let's stay consistent
let ga = undefined;
let mixpanel = undefined;
if (typeof window !== 'undefined') {
	ga = require('react-ga');
	mixpanel = require('mixpanel-browser');
}

// Don't register events if we're in DEV
const analyticsEnabled = process.env.NODE_ENV === 'production' ? true : false; 

function pageView(path, loggedIn) {
	ga.pageview(path);
	mixpanel.track('Page Viewed', {
		'path': path,
		'loggedIn': loggedIn
	});
}

function sendEvent(eventTitle, eventData, category) {
	ga.event({
		category: category || 'User',
		action: eventTitle,
	});
	mixpanel.track(eventTitle, eventData || {});
}

export default {
	pageView: analyticsEnabled ? pageView : ()=>{},
	sendEvent: analyticsEnabled ? sendEvent : ()=>{},
};
