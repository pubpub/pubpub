import googleAnalytics from '@analytics/google-analytics';
// @ts-expect-error h
import { Analytics } from '@analytics/core';
// import googleTagPlugin from '@analytics/google-tag-manager';
import type { AnalyticsSettings } from 'server/models';
import { analyticsPlugin } from './plugin';

type AnalyticsSettingsType = ReturnType<AnalyticsSettings['toJSON']>;

// POSSIBLE IMPROVEMENT: lazy load the plugins. Might be hard as they are needed when the page first loads
const getPluginForType = (type: AnalyticsSettingsType['type'], credentials: string | null) => {
	switch (type) {
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
	}: {
		appname?: string;
	} & Omit<AnalyticsSettingsType, 'id'> = {
		type: 'default',
		credentials: null,
		appname: 'pubpub',
	},
) => {
	const plugin = getPluginForType(type, credentials);

	const analytics = Analytics({
		app: appname,
		debug: true,
		plugins: [plugin],
	});

	return analytics;
};
