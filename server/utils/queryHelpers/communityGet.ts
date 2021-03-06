import { Collection, Community, Page, Member } from 'server/models';
import { Community as CommunityType, DefinitelyHas } from 'utils/types';

export default (
	locationData,
	whereQuery,
): DefinitelyHas<CommunityType, 'pages' | 'collections'> => {
	return Community.findOne({
		where: whereQuery,
		include: [
			{
				model: Page,
				as: 'pages',
				separate: true,
				attributes: {
					exclude: ['updatedAt', 'communityId'],
				},
			},
			{
				model: Collection,
				as: 'collections',
				separate: true,
				include: [
					{
						model: Member,
						as: 'members',
					},
				],
			},
		],
	}).then((communityResult) => {
		if (!communityResult) {
			throw new Error('Community Not Found');
		}
		return communityResult.toJSON();
	});
};
