import { usePage, useTrack } from 'use-analytics';

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

type PageViewPub = PageViewPayloadBase & {
	type: 'pub';
	pubId: string;
	pubSlug: string;
	pubTitle: string;
	collectionIds?: string[];
};

type PageViewCollection = PageViewPayloadBase & {
	type: 'collection';
	collectionId: string;
	collectionSlug: string;
	collectionTitle: string;
};

type PageViewPage = PageViewPayloadBase & {
	type: 'page';
	pageSlug: string;
};

export type PageViewPayload = PageViewPub | PageViewCollection | PageViewPage;

type Analytics = {
	track: <T extends Tracks>(event: T['type'], data: T['payload']) => void;
	page: <Payload extends PageViewPayload>(payload?: Payload) => void;
};

export const useAnalytics = () => {
	const page = usePage();
	const track = useTrack();

	if (typeof window === 'undefined') {
		return {
			track: () => {},
			page: () => {},
		} as Analytics;
	}

	return {
		track,
		page,
	} as Analytics;
};
