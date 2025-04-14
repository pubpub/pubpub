/* eslint-disable no-await-in-loop */
import { Pub } from 'server/models';

import fs from 'fs';
import tmp from 'tmp-promise';
import { assetsClient } from 'server/utils/s3';
import { buildPubOptions } from 'server/utils/queryHelpers';
import { Transform, Readable, PassThrough } from 'stream';
import { performance } from 'perf_hooks';

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

	return new Readable({
		objectMode: true,
		async read() {
			if (!hasMore) {
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
					getEdgesOptions: {
						includeTargetPub: true,
					},
				}),
				offset,
				limit: batchSize,
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

// memory stats helper that returns formatted memory usage
const getMemoryStats = () => {
	const used = process.memoryUsage();
	return {
		heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
		heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
		rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
	};
};

// wraps a stream to track memory at each data event
// eslint-disable-next-line no-undef
const createMemoryTracker = (stream: NodeJS.ReadableStream, batchSize = 100) => {
	let maxHeapUsed = 0;
	let dataCount = 0;

	stream.on('data', () => {
		const { heapUsed } = process.memoryUsage();
		maxHeapUsed = Math.max(maxHeapUsed, heapUsed);
		dataCount++;

		// log every 100 items to avoid console spam
		if (dataCount % batchSize === 0) {
			console.log(`Memory after ${dataCount} items:`, getMemoryStats());
		}
	});

	return { maxHeapUsed, dataCount };
};

const BATCH_SIZE = 500;

export const archiveTask = async ({ communityId, key }: { communityId: string; key: string }) => {
	const startTime = performance.now();
	console.log('Initial memory usage:', getMemoryStats());

	const pubStream = await createPubStream(communityId, BATCH_SIZE);
	const jsonTransform = createJsonTransform();

	const multiStream = new PassThrough();

	const pubTracker = createMemoryTracker(pubStream, BATCH_SIZE);
	const jsonTracker = createMemoryTracker(jsonTransform, BATCH_SIZE);

	pubStream.pipe(jsonTransform).pipe(multiStream);

	// upload directly to s3
	await assetsClient.uploadFileSplit(key, multiStream);

	const endTime = performance.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);

	console.log('Final memory usage:', getMemoryStats());
	console.log(`Total time: ${duration} seconds`);
	console.log('Peak memory usage during streaming:', {
		pubStream: `${Math.round(pubTracker.maxHeapUsed / 1024 / 1024)} MB`,
		jsonTransform: `${Math.round(jsonTracker.maxHeapUsed / 1024 / 1024)} MB`,
	});

	return `https://assets.pubpub.org/${key}`;
};
