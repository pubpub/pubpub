import { InsertableActivityItem } from 'types';
import { ActivityItem, Collection } from 'server/models';

const createActivityItem = (ai: InsertableActivityItem) => {
	return ActivityItem.create(ai);
};

export const createCollectionActivityItem = async (
	kind: 'collection-updated',
	oldTitle: string,
	oldIsPublic: boolean,
	oldIsRestricted: boolean,
	collectionId: string,
	userId: string,
	communityId: string,
) => {
	const collection = await Collection.findOne({ where: { id: collectionId } });
	const { title, isPublic, isRestricted } = collection;
	const payload = {
		isPublic: {
			from: oldIsPublic,
			to: isPublic,
		},
		isRestricted: {
			from: oldIsRestricted,
			to: isRestricted,
		},
		title: {
			from: oldTitle,
			to: title,
		},
		layout: true,
		metadata: true,
	};
	createActivityItem({
		kind,
		actorId: userId,
		communityId,
		payload: {
			collection: {
				title,
			},
			...payload,
		},
	});
};
