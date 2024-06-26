import { InitialData } from 'types';

export const shouldUseNewAnalytics = (featureFlags: InitialData['featureFlags']) =>
	featureFlags?.newAnalytics;

export const canUseCustomAnalyticsProvider = (featureFlags: InitialData['featureFlags']) =>
	featureFlags?.customAnalyticsProvider;

export const noCookieBanner = (featureFlags: InitialData['featureFlags']) =>
	featureFlags?.noCookieBanner;
