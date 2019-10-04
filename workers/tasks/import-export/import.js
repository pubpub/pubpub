/* eslint-disable no-restricted-syntax */
import path from 'path';
import nodePandoc from 'node-pandoc';
import { parsePandocJson, fromPandoc } from '@pubpub/prosemirror-pandoc';

import pandocRules from './rules';
import { buildTmpDirectory } from './tmpDirectory';
import { extractBibliographyItems } from './bibliography';

export const extensionToPandocFormat = {
	docx: 'docx',
	epub: 'epub',
	html: 'html',
	md: 'markdown_strict',
	odt: 'odt',
	txt: 'plain',
	xml: 'jats',
	tex: 'latex',
};

const isPubPubProduction = !!process.env.PUBPUB_PRODUCTION;
const dataRoot = process.env.NODE_ENV === 'production' ? '/app/.apt/usr/share/pandoc/data ' : '';

const createUrlGetter = (sourceFiles, documentLocalPath) => (resourceRelativePath) => {
	// First, try to find a file in the uploads with the exact relative path
	const documentContainer = path.dirname(documentLocalPath);
	for (const { localPath, url } of sourceFiles) {
		if (resourceRelativePath === path.relative(documentContainer, localPath)) {
			return url;
		}
	}
	// Having failed, just look for a source file with the same name as the requested file.
	const baseName = path.basename(resourceRelativePath);
	for (const { localPath, url } of sourceFiles) {
		if (localPath === baseName) {
			return url;
		}
	}
	return null;
};

const extensionFor = (filePath) =>
	filePath
		.split('.')
		.pop()
		.toLowerCase();

const createPandocArgs = (pandocFormat, tmpDirPath) => {
	const shouldExtractMedia = ['odt', 'docx', 'epub'].includes(pandocFormat);
	return [
		[`--data-dir=${dataRoot}`],
		['-f', pandocFormat],
		['-t', 'json'],
		shouldExtractMedia && [`--extract-media=${tmpDirPath}`],
	]
		.filter((x) => x)
		.reduce((acc, next) => [...acc, ...next], []);
};

const callPandoc = (file, args) =>
	new Promise((resolve, reject) =>
		nodePandoc(file, args, (err, result) => {
			console.warn(err);
			if (err && err.message) {
				console.warn(err.message);
			}
			if (result && !err) {
				resolve(result);
			}
			if (result && err) {
				reject(new Error('Error in Pandoc'));
			}
		}),
	);

const createTransformResourceGetter = (getUrlByLocalPath, getBibliographyItemById, warnings) => (
	resource,
	context,
) => {
	if (context === 'citation') {
		const item = getBibliographyItemById(resource);
		if (item) {
			return item;
		}
		warnings.push({ type: 'missingCitation', id: resource });
		return { structuredValue: '', unstructuredValue: '' };
	}
	if (context === 'image') {
		if (resource.startsWith('http://') || resource.startsWith('https://')) {
			return resource;
		}
		const url = getUrlByLocalPath(resource);
		if (url) {
			return `https://assets.pubpub.org/${url}`;
		}
		warnings.push({ type: 'missingImage', path: resource });
		return resource;
	}
	return resource;
};

export default async ({ sourceFiles }) => {
	const document = sourceFiles.find((file) => file.label === 'document');
	const bibliography = sourceFiles.find((file) => file.label === 'bibliography');
	if (!document) {
		throw new Error('No target document specified.');
	}
	const extension = extensionFor(document.localPath);
	const pandocFormat = extensionToPandocFormat[extension];
	if (!pandocFormat) {
		throw new Error(`Cannot find Pandoc format for .${extension} file.`);
	}
	const { tmpDir, getTmpPathByLocalPath } = await buildTmpDirectory(sourceFiles);
	const pandocResult = JSON.parse(
		await callPandoc(
			getTmpPathByLocalPath(document.localPath),
			createPandocArgs(pandocFormat, tmpDir.path),
		),
	);
	const pandocAst = parsePandocJson(pandocResult);
	const getBibliographyItemById = extractBibliographyItems(
		pandocAst,
		bibliography && getTmpPathByLocalPath(bibliography.localPath),
	);
	const getUrlByLocalPath = createUrlGetter(sourceFiles, document.localPath);
	const warnings = [];
	const prosemirrorDoc = fromPandoc(pandocAst, pandocRules, {
		resource: createTransformResourceGetter(
			getUrlByLocalPath,
			getBibliographyItemById,
			warnings,
		),
	}).asNode();
	return { doc: prosemirrorDoc, warnings: warnings };
};
