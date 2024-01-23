// @ts-expect-error h
import { Analytics } from '@analytics/core';
import type { AnalyticsInstance } from 'analytics';
import googleTagPlugin from '@analytics/google-tag-manager';
import googleAnalytics from '@analytics/google-analytics';
import type { AnalyticsWithConsent } from 'types';
import { analyticsPlugin, stubPlugin } from './plugin';

// TODO: lazy load the plugins. Might be hard as they are needed when the page first loads
// TODO: Add other analytics options
// TODO: Figure out whether all analytics need consent
const getPluginForType = ({ type, credentials, consent }: AnalyticsWithConsent) => {
	if (type !== 'default' && !consent) {
		return stubPlugin();
	}

	switch (type) {
		case 'GTM': {
			return googleTagPlugin({
				containerId: credentials,
			});
		}
		case 'GA': {
			return googleAnalytics({
				measurementIds: [credentials],
			});
		}
		default: {
			return analyticsPlugin();
		}
	}
};

export const createAnalyticsInstance = (
	{
		appname = 'pubpub',
		...settings
	}: {
		appname?: string;
	} & AnalyticsWithConsent = {
		type: 'default',
		credentials: null,
		appname: 'pubpub',
		consent: false,
	},
) => {
	const plugin = getPluginForType(settings);

	const analytics = Analytics({
		app: appname,
		debug: true,
		plugins: [plugin],
	});

	return analytics as AnalyticsInstance;
};
