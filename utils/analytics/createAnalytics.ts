// import { Analytics } from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
// @ts-expect-error h
import { Analytics } from '@analytics/core';
import googleTagPlugin from '@analytics/google-tag-manager';
import { analyticsPlugin } from './plugin';
import type { AnalyticsSettings } from 'server/models';

type AnalyticsSettingsType = ReturnType<AnalyticsSettings['toJSON']>;

const ourGID = 'G-9GK39XDD27';

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

export const createAnalytics = (
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
	console.log('AAA');
	const plugin = getPluginForType(type, credentials);

	const analytics = Analytics({
		app: appname,
		debug: true,
		plugins: [plugin],
	});

	return analytics;
};
