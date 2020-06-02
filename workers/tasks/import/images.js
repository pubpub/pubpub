import { exec } from 'child_process';
import tmp from 'tmp-promise';
import sharp from 'sharp';

import { extensionFor } from './util';

export const convertFileTypeIfNecessary = async (tmpFilePath) => {
	const extension = extensionFor(tmpFilePath);
	if (extension === 'pdf') {
		// Convert with pdftoppm
		const { path: pngPath } = await tmp.file({ postfix: '.png' });
		// pdftoppm tacks the extension onto the output file name. Whatever.
		const pathWithoutExtension = pngPath.slice(0, -4);
		return new Promise((resolve, reject) =>
			exec(
				`pdftoppm ${tmpFilePath} ${pathWithoutExtension} -png -singlefile -rx 300 -ry 300`,
				(err) => {
					if (err) {
						return reject(err);
					}
					return resolve(pngPath);
				},
			),
		);
	}
	if (extension === 'tiff' || extension === 'tif') {
		const { path: pngPath } = await tmp.file({ postfix: '.png' });
		await sharp(tmpFilePath).toFile(pngPath);
		return pngPath;
	}
	return tmpFilePath;
};
