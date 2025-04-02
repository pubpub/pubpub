import archiver from 'archiver';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import { Community } from 'server/models';
import tmp from 'tmp-promise';
import { expect } from 'utils/assert.js';
import { communityUrl } from 'utils/canonicalUrls';
import scrape from 'website-scraper';

type DownloadTaskOptions = {
	communityId: string;
};

const zipDir = async (dirPath: string) => {
	return new Promise<string>((resolve, reject) => {
		const archivePath = `${dirPath}.zip`;
		const archiveWriter = createWriteStream(archivePath)
			.on('end', () => {
				resolve(archivePath);
			})
			.on('error', reject);
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
			.directory(dirPath, false);
		archive.pipe(archiveWriter);
		archive.finalize();
	});
};

const downloadTask = async (options: DownloadTaskOptions) => {
	const tmpDir = await tmp.dir();
	const community = expect(await Community.findByPk(options.communityId));
	const communityURL = communityUrl(community);
	const communityArchiveDir = `${tmpDir.path}/${community.id}`;
	const urlFilter = (url: string) => url.indexOf(communityURL) === 0;
	await scrape({
		directory: communityArchiveDir,
		urls: [communityURL],
		urlFilter,
		recursive: true,
		maxDepth: 3,
		requestConcurrency: 1,
		filenameGenerator: 'bySiteStructure',
	});
	await zipDir(communityArchiveDir);
	await fs.rm(communityArchiveDir, { recursive: true, force: true });
	await tmpDir.cleanup();
};

export { downloadTask };
