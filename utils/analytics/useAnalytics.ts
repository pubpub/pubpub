import { useEffect, useState } from 'react';
import type { AnalyticsType } from 'types';
import { usePage, useTrack } from 'use-analytics';
import { stubPlugin } from './plugin';

type Tracks = {
	type: 'download';
	payload: {
		format: string;
		pubId: string;
	};
};

type PageViewPayloadBase = {
	communityId: string;
	communityName?: string;
	title: string;
};

type CollectionPayloadPart = {
	collectionId: string;
	collectionSlug: string;
	collectionTitle: string;
};

type PageViewPub = PageViewPayloadBase & {
	type: 'pub';
	pubId: string;
	pubSlug: string;
	pubTitle: string;
	collectionIds?: string[];
	primaryCollectionId?: string;
} & Partial<CollectionPayloadPart>;

type PageViewCollection = PageViewPayloadBase & {
	type: 'collection';
} & CollectionPayloadPart;

type PageViewPage = PageViewPayloadBase & {
	type: 'page';
	pageSlug: string;
};

export type PageViewPayload = PageViewPub | PageViewCollection | PageViewPage;

type Analytics = {
	track: (<T extends Tracks>(event: T['type'], data: T['payload']) => void) & { stub?: true };
	page: (<Payload extends PageViewPayload>(
		payload?: Payload,
		options?: {
			plugins: {
				all?: boolean;
				'analytics-plugin'?: boolean;
			} & { [K in AnalyticsType]?: boolean };
		},
	) => void) & { stub?: true };
};

export const useAnalytics = () => {
	const page = usePage();
	const track = useTrack();

	if (typeof window === 'undefined') {
		const { track, page } = stubPlugin();
		return {
			track,
			page,
		} as Analytics;
	}

	return {
		track,
		page,
	} as Analytics;
};

/**
 * Custom hook that sends a page view event to the analytics services only once.
 *
 * Also handles rerender logic for GDPR consent when using Google Analytics.
 *
 * Flow for non-Google Analytics and Google Analytics + consent already given:
 *
 * 1. User visits page
 * 2. Page view event is sent to all analytics services
 *
 * Flow for Google Analytics + no consent yet given:
 *
 * 1. User visits page
 * 2. Page view event is sent to our analytics service
 * 3. User clicks "Accept" on the GDPR banner
 * 4. Page view is sent to Google Analytics.
 *
 * Flow for Google Analytics + consent refused:
 *
 * 1. User visits page
 * 2. Page view event is sent to only our analytics service
 *
 * @param payload - The payload containing the page view data or a function that returns the
 *   payload.
 * @param gdprConsent - Optional boolean indicating whether GDPR consent has been given.
 */
export const usePageOnce = (
	payload: PageViewPayload | (() => PageViewPayload | null),
	gdprConsent?: boolean | null,
) => {
	const { page } = useAnalytics();

	const [calls, setCalls] = useState(0);

	const toBeSentPayload = typeof payload === 'function' ? payload() : payload;

	useEffect(() => {
		// this is the stub call
		if (calls === 0) {
			setCalls((currentCalls) => currentCalls + 1);
			return;
		}

		if (toBeSentPayload === null) {
			return;
		}

		if (calls > 2 || (calls === 2 && !gdprConsent)) {
			return;
		}

		// first actual call
		if (calls === 1) {
			page(toBeSentPayload, {
				plugins: {
					// if users do not consent to Google Analytics, we don't want to send the page view
					'google-analytics': Boolean(gdprConsent),
				},
			});
			setCalls((currentRenders) => currentRenders + 1);
			return;
		}

		// user has accepted the GDPR banner, so send the page view to Google Analytics if not done so already
		// TODO: if the page rerenders after the user has accepted the GDPR banner, we will send the page view twice, not good
		if (calls === 2 && gdprConsent) {
			page(toBeSentPayload, {
				plugins: {
					all: false,
					'google-analytics': true,
				},
			});
			setCalls((currentRenders) => currentRenders + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, Boolean(gdprConsent)]);
};
