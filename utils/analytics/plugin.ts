/* eslint-disable no-undef, import/no-unresolved */
import { type AnalyticsPlugin } from 'analytics';

const sendData = ({ payload }: { payload: any }) => {
	// we don't want to track page renders on the server, as we cache most pages
	if (!globalThis.navigator || typeof globalThis?.navigator?.sendBeacon !== 'function') {
		return;
	}

	const {
		event,
		type,
		meta: { ts },
		properties,
	} = payload;
	// we use navigator.sendBeacon to make sure the request is sent even if the user navigates away from the page
	// and doesn't block the rest of the page
	navigator.sendBeacon(
		`/api/analytics/track`,
		JSON.stringify({ event, type, timestamp: ts, ...properties }),
	);
};

export const analyticsPlugin = () => {
	return {
		name: 'analytics-plugin',
		page: sendData,
		track: sendData,
		loaded: () => true,
		ready: () => true,
	} satisfies AnalyticsPlugin;
};

export const stubPlugin = () => {
	return {
		name: 'stub-plugin',
		page: () => {},
		track: () => {},
		loaded: () => true,
		ready: () => true,
	} satisfies AnalyticsPlugin;
};
