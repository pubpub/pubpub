import { usePage, useTrack } from 'use-analytics';

type Tracks = {
	type: 'download';
	payload: {
		format: string;
		pubId: string;
	};
};

type Analytics = {
	track: <T extends Tracks>(event: T['type'], data: T['payload']) => void;
	page: (payload?: any) => void;
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
