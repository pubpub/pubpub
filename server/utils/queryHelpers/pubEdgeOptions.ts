import {
	Community,
	CollectionPub,
	ExternalPublication,
	includeUserModel,
	Pub,
	PubAttribution,
	Release,
} from 'server/models';

import { PubEdgeIncludesOptions } from 'types';

export const getOptionsForIncludedPub = ({ includeCommunity }: { includeCommunity?: boolean }) => {
	return [
		includeCommunity && { model: Community, as: 'community' },
		{
			model: CollectionPub,
			as: 'collectionPubs',
		},
		{
			model: Release,
			as: 'releases',
		},
		{
			separate: true,
			model: PubAttribution,
			as: 'attributions',
			order: [['order', 'ASC']],
			include: [includeUserModel({ as: 'user' })],
		},
	].filter((x) => x);
};

export const getPubEdgeIncludes = ({
	includeCommunityForPubs = false,
	includeTargetPub = false,
	includePub = false,
}: PubEdgeIncludesOptions = {}) => {
	return [
		...(includeTargetPub
			? [
					{
						model: Pub,
						as: 'targetPub' as const,
						include: getOptionsForIncludedPub({
							includeCommunity: includeCommunityForPubs,
						}),
					},
			  ]
			: []),
		...(includePub
			? [
					{
						model: Pub,
						as: 'pub' as const,
						include: getOptionsForIncludedPub({
							includeCommunity: includeCommunityForPubs,
						}),
					},
			  ]
			: []),
		{
			model: ExternalPublication,
			as: 'externalPublication',
		},
	];
};
