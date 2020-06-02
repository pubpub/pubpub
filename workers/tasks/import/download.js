/* eslint-disable no-restricted-syntax */
import path from 'path';
import fs from 'fs';
import { ensureDir } from 'fs-extra';
import tmp from 'tmp-promise';

import { downloadFileFromS3, uploadFileToS3 } from './s3';
import { convertFileTypeIfNecessary } from './images';

tmp.setGracefulCleanup();

export const downloadAndConvertFiles = async (sourceFiles) => {
	const filesMap = new Map();
	const tmpDirPossiblySymlinked = await tmp.dir();
	const tmpDir = fs.opendirSync(fs.realpathSync(tmpDirPossiblySymlinked.path));
	const nextSourceFiles = await Promise.all(
		sourceFiles.map(async (sourceFile) => {
			const { url, localPath } = sourceFile;
			const tmpPath = path.join(tmpDir.path, localPath);
			await ensureDir(path.dirname(tmpPath));
			await downloadFileFromS3(url, tmpPath);
			const convertedTmpPath = await convertFileTypeIfNecessary(tmpPath);
			if (convertedTmpPath !== tmpPath) {
				const convertedUrl = await uploadFileToS3(convertedTmpPath);
				return { url: convertedUrl, localPath: localPath };
			}
			filesMap.set(localPath, convertedTmpPath);
			return sourceFile;
		}),
	);
	return {
		getTmpPathByLocalPath: (localPath) => filesMap.get(localPath),
		tmpDir: tmpDir,
		sourceFiles: nextSourceFiles,
	};
};
