import { ActivityItem as ActivityItemType } from 'types';
import { ActivityItem } from 'server/models';

type ActivityItemInsert = Omit<ActivityItemType, 'createdAt' | 'updatedAt' | 'id'>;

export const addActivityItem = async (item: ActivityItemInsert) => {
	console.log('creating!');
	return ActivityItem.create(item);
};

export const getActivityItems = async (userId) => {
	const items = await ActivityItem.findAll();
	console.log({ items, userId });
	return items;
};
