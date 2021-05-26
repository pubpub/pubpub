import { Diff } from '../util';
import { MemberPermission } from '../member';

import { InsertableActivityItemBase } from './util';

type Scoped<T> =
	| { communityId: string; payload: { community: T } }
	| { collectionId: string; payload: { collection: T } }
	| { pubId: string; payload: { pub: T } };

type MemberActivityItemBase = InsertableActivityItemBase &
	Scoped<{ title: string }> & {
		payload: {
			userId: string;
		};
	};

export type MemberCreated = MemberActivityItemBase & {
	kind: 'member-created';
	payload: {
		permissions: MemberPermission;
	};
};

export type MemberUpdatedActivityItem = MemberActivityItemBase & {
	kind: 'member-updated';
	payload: {
		permissions: Diff<MemberPermission>;
	};
};

export type MemberRemovedActivityItem = MemberActivityItemBase & {
	kind: 'member-removed';
};

export type MemberActivityItem =
	| MemberCreated
	| MemberUpdatedActivityItem
	| MemberRemovedActivityItem;
