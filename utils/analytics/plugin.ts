/* eslint-disable no-undef, import/no-unresolved */
import { type AnalyticsPlugin } from 'analytics';

const ANALYTICS_ENDPOINT = '/api/analytics/track' as const;

/**
 * Adds referrer information to the payload. If there is no referrer, sets referrer to null and
 * sameReferrer to false.
 *
 * @param payload - The payload object containing properties.
 * @returns The updated payload object with referrer and sameReferrer properties.
 */
const updatePayloadWithReferrer = <P extends { properties: Record<string, any> }>(payload: P) => {
	const referrer = window.document.referrer;

	if (!referrer) {
		return {
			...payload,
			properties: {
				...payload.properties,
				referrer: null,
				isSameOriginReferrer: false,
			},
		};
	}

	const referrerUrl = new URL(referrer);
	const currentUrl = new URL(window.location.href);

	return {
		...payload,
		properties: {
			...payload.properties,
			referrer,
			isSameOriginReferrer: referrerUrl.origin === currentUrl.origin,
		},
	};
};

const sendData = ({ payload }: { payload: any }) => {
	// we don't want to track page renders on the server, as we cache most pages
	if (!globalThis.navigator || typeof globalThis?.navigator?.sendBeacon !== 'function') {
		return;
	}

	const payloadWithReferrer = updatePayloadWithReferrer(payload);

	// we use navigator.sendBeacon to make sure the request is sent even if the user navigates away from the page
	// and doesn't block the rest of the page
	navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(payloadWithReferrer));
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
