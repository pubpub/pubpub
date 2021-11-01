import pick from 'lodash.pick';
import omit from 'lodash.omit';
import { GroupedActivityItems } from 'client/components/Email';

import { ActivityItem } from 'types';
import { fetchActivityItems } from 'server/activityItem/fetch';

const getAffectedObject = (item) =>
	item.pubId
		? { id: item.pubId, title: item.payload.pub.title }
		: item.collectionId
		? { id: item.collectionId, title: item.payload.collection.title }
		: 'page' in item.payload
		? pick(item.payload.page, ['id', 'title'])
		: { id: item.communityId, title: item.payload.community.title };

const getAffectedObjectIcon = (item: ActivityItem) =>
	item.pubId
		? 'pubDoc'
		: item.collectionId
		? 'collection'
		: 'page' in item.payload && item.payload.page.id
		? 'page-layout'
		: 'office';

type KeyedActivityItem = ActivityItem & {
	displayKey: string;
};

export const getDigestData = async (initialData) => {
	const {
		communityData: { id: communityId },
		scopeData: { scope },
		loginData: { id: userId },
	} = initialData;
	const { activityItems, associations } = await fetchActivityItems({ scope });
	const activityItemsGroupedByObjectId: Record<
		string,
		KeyedActivityItem[]
	> = activityItems.reduce((result, item) => {
		const objectId = getAffectedObject(item).id;
		const payloadKeys = Object.keys(item.payload)
			.sort()
			.join();
		const displayKey = `${item.kind} - ${payloadKeys}`;
		return {
			...result,
			[objectId]: [...(result[objectId] || []), { ...item, displayKey }],
		};
	}, {});
	const dedupedActivityItems = Object.keys(activityItemsGroupedByObjectId).reduce(
		(memo, objectId) => ({
			...memo,
			[objectId]: {
				items: activityItemsGroupedByObjectId[objectId]
					.sort((first, second) => (first.timestamp > second.timestamp ? -1 : 1))
					.reduce(
						(result, item) =>
							item.displayKey in result
								? result
								: { ...result, [item.displayKey]: item },
						{},
					),
				title: getAffectedObject(activityItemsGroupedByObjectId[objectId][0])?.title,
				icon: getAffectedObjectIcon(activityItemsGroupedByObjectId[objectId][0]),
			},
		}),
		{},
	);

	const communityItems: GroupedActivityItems = pick(dedupedActivityItems, communityId);
	const pubItems: GroupedActivityItems = omit(dedupedActivityItems, communityId);
	return {
		userId, // replace this with email recipient's userId
		associations,
		pubItems,
		communityItems,
	};
};
