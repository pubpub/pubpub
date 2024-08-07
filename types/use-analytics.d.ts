/**
 * The analytics packages have very bad to nonexistent types. Here we supplement some of them with
 * our owntypes.
 */

declare module 'use-analytics' {
	import type { ComponentType, Context, FC, ReactNode } from 'react';
	import type { AnalyticsInstance, AnalyticsPlugin } from 'analytics';

	export function withAnalytics<P extends object>(Component: ComponentType<P>): FC<P>;

	export function useAnalytics(): AnalyticsInstance;
	export function useTrack(): AnalyticsInstance['track'];
	export function usePage(): AnalyticsInstance['page'];
	export function useIdentify(): AnalyticsInstance['identify'];

	export const AnalyticsConsumer: Context<AnalyticsInstance>['Consumer'];
	export const AnalyticsContext: Context<AnalyticsInstance>;

	export function AnalyticsProvider(props: {
		instance: AnalyticsInstance;
		children: ReactNode;
		// eslint-disable-next-line no-undef
	}): JSX.Element;

	export type { AnalyticsInstance, AnalyticsPlugin };
}
