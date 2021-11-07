import { Diff } from '../util';

import { InsertableActivityItemBase } from './base';

type SubmissionActivityItemBase = InsertableActivityItemBase & {
	pubId: string;
	payload: {
		pub: {
			title: string;
		};
	};
};

export type SubmissionCreatedActivityItem = SubmissionActivityItemBase & {
	kind: 'submission-created';
};

export type SubmissionStatusChangedActivityItem = SubmissionActivityItemBase & {
	kind: 'submission-status-changed';
	payload: {
		status: Diff<string>;
	};
};

export type SubmissionDeletedActivityItem = SubmissionActivityItemBase & {
	kind: 'submission-deleted';
};

export type SubmissionActivityItem =
	| SubmissionCreatedActivityItem
	| SubmissionStatusChangedActivityItem
	| SubmissionDeletedActivityItem;
