import { renderXml } from '@pubpub/deposit-utils/datacite';
import { Request, Router } from 'express';

import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { indexByProperty } from 'utils/arrays';
import { PubsQuery, PubGetOptions, Pub, DefinitelyHas } from 'types';

import { assert, expect } from 'utils/assert';
import { generateDoi, persistCrossrefDepositRecord, persistDoiData } from 'server/doi/queries';
import { transformPubToResource } from 'deposit/transform/pub';
import { Resource } from 'deposit/types';
import {
	createDataciteDoiWithMetadata,
	createDeposit,
	updateDataciteDoiMetadata,
} from 'deposit/datacite';

import { canCreatePub, getUpdatablePubFields, canDestroyPub } from './permissions';
import { createPub, updatePub, destroyPub, findPub } from './queries';
import { queryPubIds, getPubsById } from './queryMany';
import { getCommunityDepositTarget } from 'server/depositTarget/queries';

type ManyRequestParams = {
	query: Omit<PubsQuery, 'communityId'>;
	alreadyFetchedPubIds: string[];
	pubOptions: PubGetOptions;
};

const getManyQueryParams = (req): ManyRequestParams => {
	const { query, alreadyFetchedPubIds, pubOptions = {} } = req.body;
	const {
		collectionIds,
		excludeCollectionIds,
		excludePubIds,
		isReleased,
		limit = 50,
		offset = 0,
		ordering,
		scopedCollectionId,
		withinPubIds,
		term,
		submissionStatuses,
		relatedUserIds,
	} = query;
	return {
		pubOptions,
		alreadyFetchedPubIds,
		query: {
			collectionIds,
			excludeCollectionIds,
			excludePubIds,
			isReleased,
			limit,
			offset,
			ordering,
			scopedCollectionId,
			withinPubIds,
			term,
			submissionStatuses,
			relatedUserIds,
		},
	};
};

app.post(
	'/api/pubs/many',
	wrap(async (req, res) => {
		const initialData = await getInitialData(req);
		const { query: queryPartial, alreadyFetchedPubIds, pubOptions } = getManyQueryParams(req);
		const { limit } = queryPartial;
		const pubIds = await queryPubIds({
			...queryPartial,
			communityId: initialData.communityData.id,
		});
		const loadedAllPubs = limit && limit > pubIds.length;
		const idsToFetch = pubIds.filter((id) => !alreadyFetchedPubIds.includes(id));
		const pubs = await getPubsById(idsToFetch, pubOptions).sanitize(initialData);
		const pubsById = indexByProperty(pubs, 'id');
		return res.status(200).json({
			pubIds: pubIds.filter((id) => !!pubsById[id] || alreadyFetchedPubIds.includes(id)),
			pubsById,
			loadedAllPubs,
		});
	}),
);

const getRequestIds = (req) => {
	const user = req.user || {};
	const { communityId, collectionId, pubId, createPubToken } = req.body;
	return {
		userId: user.id,
		communityId,
		collectionId,
		createPubToken,
		pubId,
	};
};

app.post(
	'/api/pubs',
	wrap(async (req, res) => {
		const { userId, collectionId, communityId, createPubToken } = getRequestIds(req);
		const { create, collectionIds } = await canCreatePub({
			userId,
			collectionId,
			communityId,
			createPubToken,
		});
		if (create) {
			const newPub = await createPub({ communityId, collectionIds }, userId);
			return res.status(201).json(newPub);
		}
		throw new ForbiddenError();
	}),
);

app.put(
	'/api/pubs',
	wrap(async (req, res) => {
		const { userId, pubId } = getRequestIds(req);
		const updatableFields = await getUpdatablePubFields({
			userId,
			pubId,
		});
		if (updatableFields) {
			const updateResult = await updatePub(req.body, updatableFields, userId);
			return res.status(200).json(updateResult);
		}
		throw new ForbiddenError();
	}),
);

app.delete(
	'/api/pubs',
	wrap(async (req, res) => {
		const { userId, pubId } = getRequestIds(req);
		const canDestroy = await canDestroyPub({ userId, pubId });
		if (canDestroy) {
			await destroyPub(pubId, userId);
			return res.status(200).json({});
		}
		throw new ForbiddenError();
	}),
);

let router = Router();

function loadPubResourceMeta(
	pub: DefinitelyHas<Pub, 'community'>,
	pubResource: Resource,
	pubDoi: string,
) {
	pubResource.identifiers.push({
		identifierKind: 'DOI',
		identifierValue: pubDoi,
	});

	pubResource.meta['created-date'] = pub.createdAt.toString();

	if (pub.updatedAt !== pub.createdAt) {
		pubResource.meta['updated-date'] = pub.updatedAt.toString();
	}

	pubResource.meta['publisher'] = pub.community.publishAs || 'PubPub';
}

type PubRequest = Request & { pub: DefinitelyHas<Pub, 'community'> };

async function assertUserAuthorized(userId: string, pubId: string) {
	const pubFields = await getUpdatablePubFields({ userId, pubId });
	assert(expect(pubFields).includes('doi'));
}

router
	.post(
		'/doi',
		wrap(async (req: PubRequest, res) => {
			const pub = await findPub(req.params.pubId);
			assertUserAuthorized(expect(req.user).id, pub.id);
			const requestIds = {
				communityId: pub.communityId,
				pubId: pub.id,
				collectionId: undefined,
			};
			const communityDepositTarget = expect(
				await getCommunityDepositTarget(pub.communityId, true),
			);
			const pubDois = await generateDoi(requestIds, 'pub');
			const pubDoi = expect(pubDois.pub);
			const pubResource = await transformPubToResource(
				// @ts-ignore
				pub.get({ plain: true }),
				pub.community,
			);
			const pubResourceUrl = expect(
				pubResource.identifiers.find((identifier) => identifier.identifierKind === 'URL'),
			).identifierValue;
			loadPubResourceMeta(pub, pubResource, pubDoi);

			try {
				const pubDepositAst = createDeposit(pubResource);
				const pubDepositXml = await renderXml(pubDepositAst);
				const pubDepositResult = await (pub.crossrefDepositRecordId
					? updateDataciteDoiMetadata
					: createDataciteDoiWithMetadata)(
					pubDepositXml,
					pubResourceUrl,
					pubDoi,
					communityDepositTarget,
				);
				await Promise.all([
					persistDoiData(requestIds, pubDois),
					persistCrossrefDepositRecord(requestIds, pubDepositResult),
				]);

				return res.status(200).json(pubDepositAst);
			} catch (error) {
				return res.status(400).json({ error: (error as Error).message });
			}
		}),
	)
	.post(
		'/doi/preview',
		wrap(async (req: PubRequest, res) => {
			const pub = await findPub(req.params.pubId);
			assertUserAuthorized(expect(req.user).id, pub.id);
			const requestIds = {
				communityId: pub.communityId,
				pubId: pub.id,
				collectionId: undefined,
			};
			const pubDois = await generateDoi(requestIds, 'pub');
			const pubResource = await transformPubToResource(
				// @ts-ignore
				pub.get({ plain: true }),
				pub.community,
			);
			loadPubResourceMeta(pub, pubResource, expect(pubDois.pub));
			try {
				const pubDeposit = createDeposit(pubResource);
				return res.status(200).json(pubDeposit);
			} catch (error) {
				return res.status(400).json({ error: (error as Error).message });
			}
		}),
	);

app.use('/api/pub/:pubId', router);
