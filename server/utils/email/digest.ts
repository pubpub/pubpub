import pick from 'lodash.pick';
import omit from 'lodash.omit';

import { InitialData, ActivityItem, ActivityAssociations } from 'types';
import { GroupedActivityItems } from 'client/components/Email';
import { fetchActivityItems } from 'server/activityItem/fetch';

const getAffectedObject = (item, associations: ActivityAssociations) =>
	item.pubId
		? { id: item.pubId, title: associations.pub[item.pubId].title }
		: item.collectionId
		? { id: item.collectionId, title: associations.collection[item.collectionId].title }
		: 'page' in item.payload
		? { id: item.payload.pageId, title: associations.collection[item.payload.pageId].title }
		: { id: item.communityId, title: associations.community[item.communityId].title };

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

export const getDigestData = async (initialData: InitialData) => {
	const {
		communityData: { id: communityId },
		scopeData: { scope },
		loginData: { id: userId },
	} = initialData;
	const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

	const { activityItems, associations } = await fetchActivityItems({ scope, since });
	const activityItemsGroupedByObjectId: Record<
		string,
		KeyedActivityItem[]
	> = activityItems.reduce((result, item) => {
		const objectId = getAffectedObject(item, associations).id;
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
		(memo, objectId) => {
			const items = activityItemsGroupedByObjectId[objectId];
			return {
				...memo,
				[objectId]: {
					items: items
						.sort((first, second) => (first.timestamp > second.timestamp ? -1 : 1))
						.reduce(
							(result, item) =>
								item.displayKey in result
									? result
									: { ...result, [item.displayKey]: item },
							{},
						),
					title: getAffectedObject(items[0], associations)?.title,
					icon: getAffectedObjectIcon(items[0]),
				},
			};
		},
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
