import { ActivityItemBase } from './util';

export type ThreadActivityItemBase = ActivityItemBase & {
	payload: {
		threadId: string;
		isReply: boolean;
		threadComment: {
			id: string;
			text: string;
			userId: string;
		};
	};
};
