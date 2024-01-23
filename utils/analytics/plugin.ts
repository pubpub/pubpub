/* eslint-disable no-undef, import/no-unresolved */
import { type AnalyticsPlugin } from 'analytics';

const sendData = ({ payload, route }: { payload: any; route: 'page' | 'track' | 'identify' }) => {
	// we don't want to track page renders on the server, as we cache most pages
	if (!globalThis.navigator || typeof globalThis?.navigator?.sendBeacon !== 'function') {
		return;
	}

	// we use navigator.sendBeacon to make sure the request is sent even if the user navigates away from the page
	// and doesn't block the rest of the page
	navigator.sendBeacon(`/api/analytics/${route}`, JSON.stringify(payload));
};

export const analyticsPlugin = () => {
	return {
		name: 'analytics-plugin',
		page: ({ payload }) => sendData({ payload, route: 'page' }),
		track: ({ payload }) => sendData({ payload, route: 'track' }),
		loaded: () => true,
		ready: () => true,
	} satisfies AnalyticsPlugin;
};
