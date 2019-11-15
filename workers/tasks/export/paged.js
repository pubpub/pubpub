import path from 'path';
import { exec } from 'child_process';
import { getTmpFileForExtension, writeToFile } from './util';

export const callPaged = async (staticHtml, tmpFile) => {
	const tmpHtmlFile = await getTmpFileForExtension('html');
	await writeToFile(staticHtml, tmpHtmlFile);
	return new Promise((resolve, reject) => {
		const executable = path.join(process.env.PWD, 'node_modules', '.bin', 'pagedjs-cli');
		exec(`${executable} ${tmpHtmlFile.path} -o ${tmpFile.path}`, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};
