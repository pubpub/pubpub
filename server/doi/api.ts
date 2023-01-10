import { renderXml } from '@pubpub/deposit-utils/datacite';
import { createDeposit } from 'deposit/datacite';
import { transformCollectionToResource } from 'deposit/transform/collection';
import { transformPubToResource } from 'deposit/transform/pub';
import { Resource } from 'deposit/types';
import { Community, Release } from 'server/models';
import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';
import * as types from 'types';
import { assert } from 'utils/assert';
import { parentToSupplementNeedsDoiError } from 'utils/crossref/createDeposit';
import xmlbuilder from 'xmlbuilder';
import { getPermissions } from './permissions';
import { findCollection, findPub, generateDoi, getDoiData, setDoiData } from './queries';

const assertUserAuthorized = async (target, requestIds) => {
	const permissions = await getPermissions(requestIds);
	const isAuthenticated =
		(target === 'pub' && permissions.pub) ||
		(target === 'collection' && permissions.collection);

	if (!isAuthenticated) {
		throw new ForbiddenError();
	}
};

const pubExistsAndIsMissingReleases = async (pubId) => {
	if (!pubId) {
		return false;
	}
	const releases = await Release.findAll({ where: { pubId } });
	return releases.length === 0;
};

const previewOrDepositDoi = async (user, body, options = { deposit: false }) => {
	const { deposit } = options;
	const {
		target,
		communityId,
		collectionId,
		pubId,
		contentVersion,
		reviewType,
		reviewRecommendation,
	} = body;
	const requestIds = {
		userId: user.id,
		communityId,
		collectionId: collectionId || null,
		pubId: pubId || null,
	};

	await assertUserAuthorized(target, requestIds);

	if (pubId && (await pubExistsAndIsMissingReleases(pubId))) {
		throw new ForbiddenError();
	}

	const depositJson = await (deposit ? setDoiData : getDoiData)(
		{
			communityId,
			collectionId,
			pubId,
			contentVersion,
			reviewType,
			reviewRecommendation,
		},
		target,
	);

	return depositJson;
};

app.post(
	'/api/doi',
	wrap(async (req, res) => {
		try {
			const depositJson = await previewOrDepositDoi(req.user || {}, req.body, {
				deposit: true,
			});
			return res.status(201).json(depositJson);
		} catch (err) {
			if (err === parentToSupplementNeedsDoiError) {
				return res.status(400).json({
					error: parentToSupplementNeedsDoiError.message,
				});
			}
			throw err;
		}
	}),
);

app.get(
	'/api/doiPreview',
	wrap(async (req, res) => {
		try {
			const depositJson = await previewOrDepositDoi(req.user || {}, req.query);
			const depositXml = xmlbuilder
				.create(depositJson, { headless: true })
				.end({ pretty: true });

			return res.status(200).json({
				depositJson,
				depositXml,
			});
		} catch (err) {
			if (err === parentToSupplementNeedsDoiError) {
				return res.status(400).json({ error: parentToSupplementNeedsDoiError.message });
			}
			throw err;
		}
	}),
);

app.get(
	'/api/generateDoi',
	wrap(async (req, res) => {
		const user = req.user || {};
		const { communityId, collectionId, pubId, target } = req.query;
		const requestIds = {
			userId: user.id,
			communityId,
			collectionId: collectionId || null,
			pubId: pubId || null,
		};

		await assertUserAuthorized(target, requestIds);

		return res.status(200).json({
			dois: await generateDoi({ communityId, collectionId, pubId }, target),
		});
	}),
);

function isValidTarget(target: string): target is 'pub' | 'collection' {
	return target === 'pub' || target === 'collection';
}

app.get(
	'/api/deposit',
	wrap(async (req, res) => {
		const user = req.user || {};
		const { communityId, collectionId, pubId, target } = req.query;
		const requestIds = {
			userId: user.id,
			communityId,
			collectionId: collectionId || null,
			pubId: pubId || null,
		};

		await assertUserAuthorized(target, requestIds);

		const community: types.Community = await Community.findOne({
			where: { id: requestIds.communityId },
		});

		try {
			assert(isValidTarget(target));
		} catch (error) {
			return res.status(400).json({ error: (error as Error).message });
		}

		const dois = await generateDoi(requestIds, target);

		let object:
			| types.DefinitelyHas<types.Pub, 'attributions'>
			| types.DefinitelyHas<types.Collection, 'attributions'>;
		let resource: Resource;

		if (target === 'pub') {
			const pub = (object = (await findPub(requestIds.pubId)).get({ plain: true }));
			resource = await transformPubToResource(pub, community);
		} else {
			const collection = (object = (await findCollection(requestIds.collectionId)).get({
				plain: true,
			}));
			resource = await transformCollectionToResource(collection, community);
		}

		resource.identifiers.push({
			identifierKind: 'DOI',
			identifierValue: dois[target],
		});

		resource.meta['created-date'] = object.createdAt.toString();

		if (object.updatedAt !== object.createdAt) {
			resource.meta['updated-date'] = object.updatedAt.toString();
		}

		resource.meta['publisher'] = community.publishAs || 'PubPub';

		try {
			const resourceDepositAst = createDeposit(resource);
			return res.status(200).json(resourceDepositAst);
		} catch (error) {
			return res.status(404).json({ error: (error as Error).message });
		}
	}),
);
