import { spawnSync } from 'child_process';
import { getTmpFileForExtension, writeToFile } from './util';

export const callPaged = async (staticHtml, tmpFile) => {
	const tmpHtmlFile = await getTmpFileForExtension('html');
	await writeToFile(staticHtml, tmpHtmlFile);
	spawnSync('pagedjs-cli', [tmpHtmlFile.path, '-o', tmpFile.path]);
};
