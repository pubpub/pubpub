/* eslint-disable no-undef */
import { AnalyticsPlugin } from 'analytics';

const sendData = ({ payload, route }: { payload: any; route: 'page' | 'track' | 'identify' }) => {
	if (!globalThis.navigator || typeof globalThis?.navigator?.sendBeacon !== 'function') {
		return;
	}

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
