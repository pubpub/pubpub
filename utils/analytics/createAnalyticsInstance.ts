// @ts-expect-error h
import { Analytics } from '@analytics/core';
import googleTagPlugin from '@analytics/google-tag-manager';
import googleAnalytics from '@analytics/google-analytics';
import type { AnalyticsSettings } from 'server/models';
import { analyticsPlugin, stubPlugin } from './plugin';

type AnalyticsSettingsType = ReturnType<AnalyticsSettings['toJSON']>;

// TODO: lazy load the plugins. Might be hard as they are needed when the page first loads
// TODO: Add other analytics options
// TODO: Figure out whether all analytics need consent
const getPluginForType = (
	type: AnalyticsSettingsType['type'],
	credentials: string | null,
	consent = false,
) => {
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
		type,
		credentials,
		appname = 'pubpub',
		consent = false,
	}: {
		appname?: string;
		consent?: boolean;
	} & Omit<AnalyticsSettingsType, 'id'> = {
		type: 'default',
		credentials: null,
		appname: 'pubpub',
		consent: false,
	},
) => {
	const plugin = getPluginForType(type, credentials, consent);

	const analytics = Analytics({
		app: appname,
		debug: true,
		plugins: [plugin],
	});

	return analytics;
};
