/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
	Community,
	Collection,
	Page,
	Pub,
	sequelize,
	CollectionAttribution,
	includeUserModel,
	ScopeSummary,
	Member,
	Draft,
	CustomScript,
} from 'server/models';

import fs from 'fs';
import tmp from 'tmp-promise';
import { assetsClient } from 'server/utils/s3';
import { buildPubOptions } from 'server/utils/queryHelpers';
import { Transform, Readable, PassThrough } from 'stream';
import { performance } from 'perf_hooks';
import { isProd } from 'utils/environment';
import { CollectionPub } from 'server/collectionPub/model';
import { getDatabaseRef, getPubDraftDoc } from 'server/utils/firebaseAdmin';
import { Op } from 'sequelize';
import { fetchFacetsForScopeIds } from 'server/facets';

export const getTmpDirectoryPath = async () => {
	const tmpDirPossiblySymlinked = await tmp.dir();
	const tmpDir = fs.opendirSync(fs.realpathSync(tmpDirPossiblySymlinked.path));
	return tmpDir.path;
};

const createPubStream = async (pubs: Pub[], batchSize = 100) => {
	let offset = 0;
	let hasMore = true;

	// we put this in one transaction to ensure we are getting the pubs from the same db
	const trx = await sequelize.transaction();

	return new Readable({
		objectMode: true,
		async read() {
			if (!hasMore) {
				await trx.commit();
				this.push(null);
				return;
			}

			// its more efficient to first get all the pub ids + draftRefs, then get the pubs + drafts in one go,
			// rather than first getting the pubs, looking at their draftRefs, and then getting the drafts
			// the latter would take too much time, but the current uses more memory
			const pubIdSlice = pubs.slice(offset, offset + batchSize);
			console.log(`Getting ${pubIdSlice.length} pubs`);
			performance.mark('get pubs start');
			const [foundPubs, drafts] = await Promise.all([
				Pub.findAll({
					where: { id: { [Op.in]: pubIdSlice.map((p) => p.id) } },
					...buildPubOptions({
						getCollections: false,
						getMembers: true,
						getEdges: 'all',
						getExports: true,
						getDiscussions: true,
						getSubmissions: true,
						getReviews: true,
						getDraft: true,
						getFacets: true,
						getFullReleases: true,
						getEdgesOptions: {
							includeTargetPub: true,
						},
					}),
					order: [['createdAt', 'ASC']],
					transaction: trx,
				}),
				Promise.all(
					pubIdSlice.map(async (p) => {
						const firebasePath = p.draft?.firebasePath;

						if (!firebasePath) {
							return null;
						}

						const draftDoc = await getPubDraftDoc(
							getDatabaseRef(firebasePath),
							null,
							true,
						);
						return {
							...draftDoc,
							firebasePath,
						};
					}),
				),
			]);

			const pubsWithDrafts = foundPubs.map((pub) => {
				const pubJson = pub.toJSON();
				const draft = drafts.find((d) => d?.firebasePath === pubJson.draft?.firebasePath);
				if (!draft) {
					console.error(`Draft not found for pub ${pubJson.id}`);
					return null;
				}
				return {
					...pubJson,
					draft: {
						...pubJson.draft,
						doc: draft,
					},
				};
			});

			hasMore = foundPubs.length === batchSize;
			offset += batchSize;
			console.log(`Has more: ${hasMore}. Offset: ${offset}. Limit: ${pubs.length}`);

			// eslint-disable-next-line no-restricted-syntax
			for (const pub of pubsWithDrafts) {
				this.push(pub);
			}
		},
	});
};

// memory tracking utilities only exported in dev
const createDevTools = () => {
	if (isProd()) {
		return {
			getMemoryStats: () => ({}),
			createMemoryTracker: () => ({ maxHeapUsed: 0, dataCount: 0 }),
			logStats: () => {},
		};
	}

	const getMemoryStats = () => {
		const used = process.memoryUsage();
		return {
			heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
			heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
			rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
		};
	};

	return {
		getMemoryStats,
		// eslint-disable-next-line no-undef
		createMemoryTracker: (stream: NodeJS.ReadableStream, batchSize = 100) => {
			let maxHeapUsed = 0;
			let dataCount = 0;

			stream.on('data', () => {
				const { heapUsed } = process.memoryUsage();
				maxHeapUsed = Math.max(maxHeapUsed, heapUsed);
				dataCount++;

				if (dataCount % batchSize === 0) {
					console.log(`Memory after ${dataCount} items:`, getMemoryStats());
				}
			});

			return { maxHeapUsed, dataCount };
		},
		logStats: (
			startTime: number,
			pubTracker: ReturnType<typeof devTools.createMemoryTracker>,
			jsonTracker: ReturnType<typeof devTools.createMemoryTracker>,
		) => {
			const endTime = performance.now();
			const duration = ((endTime - startTime) / 1000).toFixed(2);

			console.log('Final memory usage:', getMemoryStats());
			console.log(`Total time: ${duration} seconds`);
			console.log('Peak memory usage during streaming:', {
				pubStream: `${Math.round(pubTracker.maxHeapUsed / 1024 / 1024)} MB`,
				jsonTransform: `${Math.round(jsonTracker.maxHeapUsed / 1024 / 1024)} MB`,
			});
		},
	};
};

const devTools = createDevTools();
const BATCH_SIZE = 1000;

// create a transform that prepends community data before pubs array
const createCommunityJsonTransform = (communityData: any) => {
	let hasWrittenPrefix = false;
	return new Transform({
		objectMode: true,
		transform(chunk, _, callback) {
			if (!hasWrittenPrefix) {
				// write the community data first, then start the pubs array
				let prefix = JSON.stringify(
					{
						community: communityData.community,
						collections: communityData.collections,
						pages: communityData.pages,
						pubs: [],
					},
					null,
					2,
				);

				// so we end up with `"pubs": [`
				prefix = prefix.slice(0, -3);

				hasWrittenPrefix = true;
				try {
					const chunkString = prefix + '\n' + JSON.stringify(chunk);
					callback(null, chunkString);
				} catch (e) {
					console.dir(chunk, { depth: 6 });
					throw e;
				}
			} else {
				try {
					const chunkString = ',\n' + JSON.stringify(chunk);
					callback(null, chunkString);
				} catch (e) {
					console.dir(chunk, { depth: null });
					throw e;
				}
			}
		},
		flush(callback) {
			callback(null, '\n]}');
		},
	});
};

const getCommunityData = async (communityId: string) => {
	// fetch all community data in one transaction
	const result = await sequelize.transaction(async (trx) => {
		const [community, customScripts, collections, pages] = await Promise.all([
			Community.findByPk(communityId, {
				transaction: trx,
				include: [
					{ model: ScopeSummary, as: 'scopeSummary' },
					{
						model: Member,
						as: 'members',
						foreignKey: 'communityId',
						attributes: [
							'id',
							'userId',
							'permissions',
							'isOwner',
							'subscribedToActivityDigest',
						],
						include: [includeUserModel({ as: 'user', required: false })],
					},
				],
			}),
			CustomScript.findAll({
				where: { communityId },
				transaction: trx,
			}),
			Collection.findAll({
				where: { communityId },
				transaction: trx,
				include: [
					{
						model: CollectionPub,
						as: 'collectionPubs',
						foreignKey: 'collectionId',
					},
					{ model: ScopeSummary, as: 'scopeSummary' },
					{
						model: CollectionAttribution,
						as: 'attributions',
						include: [includeUserModel({ as: 'user', required: false })],
					},
					{
						model: Member,
						as: 'members',
						foreignKey: 'collectionId',
						// we dont care about communityId etc
						attributes: [
							'id',
							'userId',
							'permissions',
							'isOwner',
							'subscribedToActivityDigest',
						],
						include: [includeUserModel({ as: 'user', required: false })],
					},
				],
			}),
			Page.findAll({
				where: { communityId },
				transaction: trx,
			}),
		]);

		const facets = await fetchFacetsForScopeIds({
			community: [communityId],
			collection: collections.map((c) => c.id),
		});

		return {
			community: {
				...community?.toJSON(),
				facets: facets.community[communityId],
				customScripts,
			},
			collections: collections.map((c) => ({
				...c.toJSON(),
				facets: facets.collection[c.id],
			})),
			pages: pages.map((p) => p.toJSON()),
		};
	});

	return result;
};

const getPubs = async (communityId: string) => {
	const pubs = await Pub.findAll({
		where: { communityId },
		attributes: ['id'],
		include: [
			{
				model: Draft,
				as: 'draft',
				attributes: ['firebasePath'],
			},
		],
		order: [['createdAt', 'ASC']],
		limit: 1_000_000,
	});

	return pubs;
};

export const archiveTask = async ({ communityId, key }: { communityId: string; key: string }) => {
	const startTime = performance.now();
	devTools.getMemoryStats();

	// get community data + all pubs first
	const [communityData, pubs] = await Promise.all([
		getCommunityData(communityId),
		getPubs(communityId),
	]);

	console.log(`Found ${pubs.length} pubs`);
	// create streams
	const pubStream = await createPubStream(pubs, BATCH_SIZE);
	const jsonTransform = createCommunityJsonTransform(communityData);
	const multiStream = new PassThrough();

	const pubTracker = devTools.createMemoryTracker(pubStream, BATCH_SIZE);
	const jsonTracker = devTools.createMemoryTracker(jsonTransform, BATCH_SIZE);

	// pipe everything together
	pubStream.pipe(jsonTransform).pipe(multiStream);

	await assetsClient.uploadFileSplit(key, multiStream);

	devTools.logStats(startTime, pubTracker, jsonTracker);
	const endTime = performance.now();
	console.log(`Time taken to archive: ${endTime - startTime} milliseconds`);

	return `https://assets.pubpub.org/${key}`;
};
