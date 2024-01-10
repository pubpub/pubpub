import { AnalyticsPlugin } from 'analytics';

const sendData = ({ payload }: { payload: any }) =>
	navigator.sendBeacon('/api/analytics', JSON.stringify(payload));

export const analyticsPlugin = () => {
	return {
		name: 'analytics-plugin',
		page: sendData,
		track: sendData,
		identify: sendData,
		loaded: () => true,
		ready: () => true,
	} satisfies AnalyticsPlugin;
};
