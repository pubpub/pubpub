import archiver from 'archiver';
import { createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import { Community } from 'server/models';
import { createPubPubS3Client } from 'server/utils/s3';
import * as stream from 'stream';
import { pipeline } from 'stream/promises';
import tmp from 'tmp-promise';
import { expect } from 'utils/assert.js';
import { communityUrl } from 'utils/canonicalUrls';
import scrape from 'website-scraper';

type DownloadTaskOptions = {
	communityId: string;
};

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

const s3 = createPubPubS3Client({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	bucket: 'archive.pubpub.org',
	ACL: 'public-read',
});

const uploadFromStream = (key: string) => {
	const pass = new stream.PassThrough();
	s3.uploadFile(key, pass, true)
		.then(() => pass.end())
		.catch((err) => console.error(err));
	return pass;
};

const downloadTask = async (options: DownloadTaskOptions) => {
	const community = expect(await Community.findByPk(options.communityId));
	const communityURL = communityUrl(community);
	const tmpDir = await tmp.dir();
	const archiveDir = `${tmpDir.path}/${community.id}`;
	const urlFilter = (url: string) => url.indexOf(communityURL) === 0;
	await scrape({
		directory: archiveDir,
		urls: [communityURL],
		urlFilter,
		recursive: true,
		maxDepth: 2,
		requestConcurrency: 2,
		filenameGenerator: 'bySiteStructure',
	});
	const archivePath = await zipDir(archiveDir);
	const archiveReadStream = createReadStream(archivePath);
	await pipeline(archiveReadStream, uploadFromStream(`${community.id}.zip`));
	await Promise.all([fs.rm(archiveDir, { recursive: true, force: true }), fs.rm(archivePath)]);
	await tmpDir.cleanup();
};

export { downloadTask };
