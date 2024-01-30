// @ts-expect-error FIXME: types from @analytics/core are not bundled properly
import { Analytics } from '@analytics/core';
import type { AnalyticsInstance } from 'analytics';
import type { AnalyticsSettings } from 'types';
import { analyticsPlugin, stubPlugin } from './plugin';

// TODO: lazy load the plugins. Might be hard as they are needed when the page first loads, forcing a lot of rerenders
const getPluginsForType = async ({
	shouldStub,
	canUseCustomAnalyticsProvider,
	googleAnalyticsRefused,
	analyticsSettings,
}: {
	shouldStub?: boolean;
	googleAnalyticsRefused?: boolean;
	canUseCustomAnalyticsProvider?: boolean;
	analyticsSettings: AnalyticsSettings;
}) => {
	if (shouldStub) {
		return [stubPlugin()];
	}

	const analyticsPlugins = [analyticsPlugin()];

	if (!canUseCustomAnalyticsProvider) {
		return analyticsPlugins;
	}

	switch (analyticsSettings?.type) {
		case 'simple-analytics': {
			const { default: simpleAnalyticsPlugin } = await import(
				/* webpackChunkName: "@analytics/simple-analytics" */
				'@analytics/simple-analytics'
			);

			analyticsPlugins.push(
				simpleAnalyticsPlugin({
					autoCollect: false,
				}),
			);
			break;
		}
		case 'google-analytics': {
			if (googleAnalyticsRefused) {
				break;
			}

			const { default: googleAnalyticsPlugin } = await import(
				/* webpackChunkName: "@analytics/google-analytics" */
				'@analytics/google-analytics'
			);

			analyticsPlugins.push(
				googleAnalyticsPlugin({
					measurementIds: [analyticsSettings.credentials],
				}),
			);
			break;
		}
		default:
			break;
	}

	return analyticsPlugins;
};

export const createAnalyticsInstance = async ({
	appname = 'pubpub',
	shouldUseNewAnalytics,
	canUseCustomAnalyticsProvider,
	gdprConsent,
	analyticsSettings,
}: {
	appname?: string;
	shouldUseNewAnalytics?: boolean;
	canUseCustomAnalyticsProvider?: boolean;
	gdprConsent?: boolean | null;
	analyticsSettings: AnalyticsSettings;
}) => {
	const googleAnalyticsRefused = analyticsSettings?.type === 'google-analytics' && !gdprConsent;

	const plugins = await getPluginsForType({
		shouldStub: !shouldUseNewAnalytics,
		canUseCustomAnalyticsProvider,
		googleAnalyticsRefused,
		analyticsSettings,
	});

	const analytics = Analytics({
		app: appname,
		debug: true,
		plugins,
	});

	return analytics as AnalyticsInstance;
};

export const createStubAnalyticsInstance = () => {
	return Analytics({
		app: 'pubpub',
		debug: true,
		plugins: [stubPlugin()],
	});
};
