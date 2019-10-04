import { spawnSync } from 'child_process';
import Cite from 'citation-js';

const createIdToCiteGetter = (array, processEntry) => {
	const map = new Map();
	array.forEach((entry) => {
		const [key, value] = processEntry(entry);
		map.set(key, value);
	});
	return (id) => map.get(id);
};

const extractUsingPandocCiteproc = (bibliographyTmpPath) => {
	const proc = spawnSync('pandoc-citeproc', ['-j', bibliographyTmpPath]);
	const cslJson = JSON.parse(proc.stdout.toString());
	return createIdToCiteGetter(cslJson, (entry) => {
		const structuredValue = Cite.get.bibtex.text([entry]);
		return [entry.id, { structuredValue: structuredValue }];
	});
};

export const extractBibliographyItems = (pandocAst, bibliographyTmpPath) => {
	if (bibliographyTmpPath) {
		return extractUsingPandocCiteproc(bibliographyTmpPath);
	}
	return null;
};
