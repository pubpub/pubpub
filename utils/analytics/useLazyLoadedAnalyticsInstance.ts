import type { AnalyticsInstance } from 'analytics';
import { useEffect, useState } from 'react';
import { AnalyticsSettings } from 'types';
import { createAnalyticsInstance, createInitialAnalyticsInstance } from './createAnalyticsInstance';

export const useLazyLoadedAnalyticsInstance = ({
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
	const [analytics, setAnalytics] = useState<AnalyticsInstance>(
		createInitialAnalyticsInstance(shouldUseNewAnalytics),
	);

	const needsCustomPlugin =
		shouldUseNewAnalytics && canUseCustomAnalyticsProvider && analyticsSettings !== null;

	useEffect(() => {
		console.log({
			shouldUseNewAnalytics,
			canUseCustomAnalyticsProvider,
			analyticsSettings,
			needsCustomPlugin,
		});
		if (!needsCustomPlugin) {
			return;
		}

		createAnalyticsInstance({
			appname,
			shouldUseNewAnalytics,
			canUseCustomAnalyticsProvider,
			gdprConsent,
			analyticsSettings,
		}).then(setAnalytics);
	}, [Boolean(gdprConsent && needsCustomPlugin)]);

	return analytics;
};
