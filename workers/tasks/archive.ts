/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { Pub, sequelize } from 'server/models';

import fs from 'fs';
import tmp from 'tmp-promise';
import { assetsClient } from 'server/utils/s3';
import { buildPubOptions } from 'server/utils/queryHelpers';
import { Transform, Readable, PassThrough } from 'stream';
import { performance } from 'perf_hooks';
import { isProd } from 'utils/environment';

export const getTmpDirectoryPath = async () => {
	const tmpDirPossiblySymlinked = await tmp.dir();
	const tmpDir = fs.opendirSync(fs.realpathSync(tmpDirPossiblySymlinked.path));
	return tmpDir.path;
};

const createJsonTransform = () => {
	let isFirst = true;
	return new Transform({
		objectMode: true,
		transform(chunk, _, callback) {
			const json = JSON.stringify(chunk);
			const prefix = isFirst ? '[\n' : ',\n';
			isFirst = false;
			callback(null, prefix + json);
		},
		flush(callback) {
			callback(null, '\n]');
		},
	});
};

const createPubStream = async (communityId: string, batchSize = 100) => {
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

			const pubs = await Pub.findAll({
				where: { communityId },
				...buildPubOptions({
					getCollections: true,
					getMembers: true,
					getEdges: 'approved-only',
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
				offset,
				limit: batchSize,
				transaction: trx,
			});

			hasMore = pubs.length === batchSize;
			offset += batchSize;

			// eslint-disable-next-line no-restricted-syntax
			for (const pub of pubs) {
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
const BATCH_SIZE = 500;

export const archiveTask = async ({ communityId, key }: { communityId: string; key: string }) => {
	const startTime = performance.now();
	devTools.getMemoryStats();

	const pubStream = await createPubStream(communityId, BATCH_SIZE);
	const jsonTransform = createJsonTransform();
	const multiStream = new PassThrough();

	const pubTracker = devTools.createMemoryTracker(pubStream, BATCH_SIZE);
	const jsonTracker = devTools.createMemoryTracker(jsonTransform, BATCH_SIZE);

	pubStream.pipe(jsonTransform).pipe(multiStream);

	await assetsClient.uploadFileSplit(key, multiStream);

	devTools.logStats(startTime, pubTracker, jsonTracker);

	return `https://assets.pubpub.org/${key}`;
};
