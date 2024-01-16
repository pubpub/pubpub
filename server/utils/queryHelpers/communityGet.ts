import {
	Collection,
	Community,
	Page,
	Member,
	ScopeSummary,
	SpamTag,
	AnalyticsSettings,
} from 'server/models';
import { Community as CommunityType, DefinitelyHas } from 'types';

export default async (locationData, whereQuery) => {
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
			{
				model: ScopeSummary,
				as: 'scopeSummary',
			},
			{
				model: SpamTag,
				as: 'spamTag',
			},
			{
				model: AnalyticsSettings,
				as: 'analyticsSettings',
			},
		],
	}).then((communityResult) => {
		if (!communityResult) {
			throw new Error('Community Not Found');
		}
		return communityResult.toJSON() as DefinitelyHas<
			CommunityType,
			'pages' | 'collections' | 'analyticsSettings' | 'spamTag' | 'scopeSummary'
		>;
	});
};
