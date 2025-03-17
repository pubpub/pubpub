/* eslint-disable no-await-in-loop */
import { Pub } from 'server/models';

import fs from 'fs';
import tmp from 'tmp-promise';
import { join } from 'path';
import { assetsClient } from 'server/utils/s3';
import { buildPubOptions } from 'server/utils/queryHelpers';

export const getTmpDirectoryPath = async () => {
	const tmpDirPossiblySymlinked = await tmp.dir();
	const tmpDir = fs.opendirSync(fs.realpathSync(tmpDirPossiblySymlinked.path));
	return tmpDir.path;
};

export const archiveTask = async ({ communityId, key }: { communityId: string; key: string }) => {
	let offset = 0;
	const limit = 200;

	const tmpDirPath = await getTmpDirectoryPath();

	// create tmp file
	const tmpFilePath = join(tmpDirPath, 'pubs.json');

	while (true) {
		const pubs = await Pub.findAll({
			where: {
				communityId,
			},
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
			limit: limit + 1,
		});

		const lastElement = pubs.pop();

		let stringifiedPubs = JSON.stringify(pubs, null, 2);

		if (pubs.length === limit && lastElement) {
			stringifiedPubs = `${stringifiedPubs.slice(0, stringifiedPubs.length - 2)},`;
		}
		if (offset > 0) {
			stringifiedPubs = stringifiedPubs.replace(/^\[/, '');
		}

		if (pubs.length > 0) {
			await fs.promises.appendFile(tmpFilePath, stringifiedPubs);
		}

		offset += limit;
		if (pubs.length < limit) {
			break;
		}
	}

	// upload to s3
	const readStream = fs.createReadStream(tmpFilePath);

	await assetsClient.uploadFileSplit(key, readStream);

	return `https://assets.pubpub.org/${key}`;
};
