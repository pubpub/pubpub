import { execSync } from 'child_process';
import tmp from 'tmp-promise';
import sharp from 'sharp';

import { extensionFor } from './util';

export const convertFileTypeIfNecessary = async (tmpFilePath) => {
	const extension = extensionFor(tmpFilePath);
	if (extension === 'pdf') {
		// Convert with pdftoppm
		const { path: pngPath } = await tmp.file({ postfix: '.png' });
		execSync(`pdftoppm ${tmpFilePath} ${pngPath} -png -rx 300 -ry 300`);
		return pngPath;
	}
	if (extension === 'tiff' || extension === 'tif') {
		const { path: pngPath } = await tmp.file({ postfix: '.png' });
		await sharp(tmpFilePath).toFile(pngPath);
		return pngPath;
	}
	return tmpFilePath;
};
