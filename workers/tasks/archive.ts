/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
	Collection,
	CollectionAttribution,
	Community,
	CustomScript,
	Draft,
	Export,
	includeUserModel,
	Member,
	Page,
	Pub,
	Release,
	ScopeSummary,
	sequelize,
} from 'server/models';

import archiver from 'archiver';
import cheerio from 'cheerio';
import { createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';
import { Op } from 'sequelize';
import { CollectionPub } from 'server/collectionPub/model';
import { getOrStartExportTask } from 'server/export/queries';
import { fetchFacetsForScopeIds } from 'server/facets';
import { getDatabaseRef, getPubDraftDoc } from 'server/utils/firebaseAdmin';
import { buildPubOptions } from 'server/utils/queryHelpers';
import { assetsClient } from 'server/utils/s3';
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import tmp from 'tmp-promise';
import { DefinitelyHas, SerializedModel } from 'types';
import { expect } from 'utils/assert';
import { communityUrl } from 'utils/canonicalUrls';
import { isProd } from 'utils/environment';
import scrape from 'website-scraper';

const zipDir = (dirPath: string) => {
	return new Promise<string>((resolve, reject) => {
		const archivePath = `${dirPath}.zip`;
		const archiveWriteStream = createWriteStream(archivePath);
		const archive = archiver('zip', {
			zlib: { level: 9 },
		})
			.on('warning', (error) => {
				if (error.code === 'ENOENT') {
					console.error(error);
				} else {
					reject(error);
				}
			})
			.on('end', () => {
				resolve(archivePath);
			})
			.on('error', reject)
			.directory(dirPath, false);
		archive.pipe(archiveWriteStream);
		archive.finalize();
	});
};

const archiveCommunityHtml = async (directory: string, community: SerializedModel<Community>) => {
	const url = communityUrl(community);
	const urlFilter = (u: string) => u.indexOf(url) === 0 && !u.includes('login');
	const result = await scrape({
		directory,
		urls: [url],
		urlFilter,
		recursive: true,
		maxRecursiveDepth: 3,
		requestConcurrency: 1,
		filenameGenerator: 'bySiteStructure',
		plugins: [
			{
				apply(register) {
					register('error', async ({ error }) => {
						console.error(error);
					});
					register('onResourceError', ({ resource, error }) => {
						console.error(`Failed to fetch resource ${resource.url}`, error);
					});
					register('beforeRequest', ({ resource, requestOptions }) => {
						console.log(`Fetching ${resource.url} with options:`, requestOptions);
						return {
							resource,
							requestOptions,
						};
					});
					register('afterResponse', async ({ response }) => {
						// example pub path: pub/e0de7uq7/release/1
						// extract slug and release number
						const match = (response.requestUrl as URL).pathname.match(
							/^\/pub\/([a-z0-9]+)\/release\/(\d+)/,
						);
						if (match !== null) {
							const [slug, releaseNumberString] = match.slice(1);
							const pub = await Pub.findOne({
								where: { slug },
								include: [
									{
										model: Release,
										as: 'releases',
									},
								],
							});
							if (pub?.releases === undefined || pub.releases.length === 0) {
								console.warn(
									`No releases found for pub with slug ${slug} at ${response.requestUrl.href}`,
								);
								return response.body;
							}
							const releaseNumber = parseInt(releaseNumberString, 10);
							const release = expect(pub.releases.at(releaseNumber - 1));
							const downloads = await guaranteeDownloadsForRelease(release);
							const $ = cheerio.load(response.body);
							$('.pub-download-component')
								.remove('[role=menuitem]')
								.append(
									downloads
										.map((download) => {
											return `<li tabindex="-1" aria-disabled="false" role="menuitem"><a target="_self" class="bp3-menu-item" href="${
												download.url
											}"><div class="bp3-text-overflow-ellipsis bp3-fill"><span class="bp3-popover-wrapper"><span class="bp3-popover-target"><span class="" tabindex="0">${download.format.toUpperCase()}</span></span></span></div><span class="bp3-menu-item-label"><span></span></span></a></li>`;
										})
										.join(''),
								);
							return $.html();
						}
						console.log(
							`Fetched ${response.requestUrl.href} with status: ${response.statusCode}`,
						);
						return response.body;
					});
				},
			},
		],
	});
	return result;
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
			const [foundPubs, facets, drafts] = await Promise.all([
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
				fetchFacetsForScopeIds({
					pub: pubIdSlice.map((p) => p.id),
				}),
				Promise.all(
					pubIdSlice.map(async (p) => {
						const firebasePath = p.draft?.firebasePath;

						if (!firebasePath) {
							return null;
						}

						try {
							const draftDoc = await getPubDraftDoc(
								getDatabaseRef(firebasePath),
								null,
								false,
							);
							if (!draftDoc) {
								return {
									content: null,
									firebasePath,
								};
							}
							const { doc, ...rest } = draftDoc;

							return {
								...rest,
								content: doc,
								firebasePath,
							};
						} catch (e) {
							console.error(`Error getting draft doc for pub ${p.id}:`, e);
							return null;
						}
					}),
				),
			]);

			const pubsWithDraftsAndFacets = foundPubs.map((pub) => {
				const pubJson = pub.toJSON();
				const pubFacets = facets.pub[pubJson.id];
				const firebaseDraft = drafts.find(
					(d) => d?.firebasePath === pubJson.draft?.firebasePath,
				);
				if (!firebaseDraft) {
					console.error(`Draft not found for pub ${pubJson.id}`);
				}

				return {
					...pubJson,
					facets: pubFacets,
					draft: {
						...pubJson.draft,
						doc: firebaseDraft,
					},
				};
			});

			hasMore = foundPubs.length === batchSize;
			offset += batchSize;
			console.log(`Has more: ${hasMore}. Offset: ${offset}. Limit: ${pubs.length}`);

			// eslint-disable-next-line no-restricted-syntax
			for (const pub of pubsWithDraftsAndFacets) {
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

const guaranteedExportFormats = ['pdf', 'jats'];

const wait = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const waitForExport = async (workerTaskId: string): Promise<DefinitelyHas<Export, 'url'>> => {
	while (true) {
		const pubExport = expect(
			await Export.findOne({
				where: { workerTaskId },
			}),
		);

		if (pubExport.url) {
			return pubExport as DefinitelyHas<Export, 'url'>;
		}

		if (pubExport.workerTask?.error) {
			throw new Error(`Export task ${workerTaskId} failed: ${pubExport.workerTask.error}`);
		}

		await wait(1000);
	}
};

const guaranteeDownloadsForRelease = async (release: Release) => {
	const tasks = await Promise.all(
		guaranteedExportFormats.map((format) => {
			return getOrStartExportTask({
				pubId: release.pubId,
				format,
				historyKey: release.historyKey,
			});
		}),
	);
	const downloads = await Promise.all(
		tasks.map((task) => {
			if (typeof task.url === 'string') {
				return task as DefinitelyHas<Export, 'url'>;
			}
			return waitForExport(task.taskId);
		}),
	);
	return downloads;
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

	const tmpDir = await tmp.dir();
	const tmpArchiveDir = `${tmpDir.path}/${communityId}`;

	// scrape community html and assets
	await archiveCommunityHtml(
		tmpArchiveDir,
		communityData.community as SerializedModel<Community>,
	);

	// create streams
	const pubReadStream = await createPubStream(pubs, BATCH_SIZE);
	const pubWriteStream = createWriteStream(`${tmpArchiveDir}/static.json`);
	const communityJsonTransform = createCommunityJsonTransform(communityData);

	const pubTracker = devTools.createMemoryTracker(pubReadStream, BATCH_SIZE);
	const jsonTracker = devTools.createMemoryTracker(communityJsonTransform, BATCH_SIZE);

	// pipe everything together
	await pipeline(pubReadStream, communityJsonTransform, pubWriteStream);

	const archivePath = await zipDir(tmpArchiveDir);
	const archiveReadStream = createReadStream(archivePath);

	await assetsClient.uploadFileSplit(key, archiveReadStream);

	console.log(`Uploaded archive to ${key}`);

	await Promise.all([
		// remove the archive directory
		fs.rm(tmpArchiveDir, { recursive: true, force: true }),
		// remove the archive file
		fs.rm(archivePath),
	]);
	await tmpDir.cleanup();

	devTools.logStats(startTime, pubTracker, jsonTracker);
	const endTime = performance.now();
	console.log(`Time taken to archive: ${endTime - startTime} milliseconds`);

	return `https://assets.pubpub.org/${key}`;
};
