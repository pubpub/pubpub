import { MemberActivityItem } from 'types';

import { TitleRenderer } from '../types';
import { titleCollection } from './collection';
import { titleCommunity } from './community';
import { titlePub } from './pub';

export const titleMembershipScope: TitleRenderer<MemberActivityItem> = (item, context) => {
	const { pubId, collectionId, communityId } = item;
	if (typeof pubId === 'string') {
		return titlePub({ ...item, pubId }, context);
	}
	if (typeof collectionId === 'string') {
		return titleCollection({ ...item, collectionId }, context);
	}
	return titleCommunity({ ...item, communityId }, context);
};
