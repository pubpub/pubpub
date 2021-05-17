import { Op } from 'sequelize';

import * as types from 'types';
import { IdIndex } from 'types';
import { ActivityItem, CollectionPub } from 'server/models';

type Scope = { communityId: string } & ({ pubId: string } | { collectionId: string });

type FetchActivityItemsOptions = {
	scope: Scope;
	limit?: number;
	offset?: number;
};

type FetchActivityItemsResult = {
	activityItems: types.ActivityItem[];
	associations: {
		pubs: IdIndex<types.Pub>;
		collections: IdIndex<types.Collection>;
		users: IdIndex<types.User>;
	};
};

const getPubsWhereQueryForScope = async (scope: Scope) => {
	if ('pubId' in scope) {
		return { pubId: scope.pubId };
	}
	if ('collectionId' in scope) {
		const collectionPubs = await CollectionPub.findAll({
			where: { collectionId: scope.collectionId },
			attributes: ['pubId'],
		});
		return {
			pubId: {
				[Op.in]: collectionPubs.map((cp) => cp.pubId),
			},
		};
	}
	return null;
};

const fetchActivityItemModels = async (options: FetchActivityItemsOptions) => {
	const { scope, limit = 50, offset = 0 } = options;
	return ActivityItem.findAll({
		limit,
		offset,
		where: {
			communityId: scope.communityId,
			...(await getPubsWhereQueryForScope(scope)),
		},
	});
};

const fetchActivityItems = async (options: FetchActivityItemsOptions) => {
	const activityItemModels = await fetchActivityItemModels(options);
};
