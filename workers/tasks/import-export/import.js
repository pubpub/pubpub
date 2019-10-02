/* eslint-disable no-restricted-syntax */
import path from 'path';
import fs from 'fs';
import tmp from 'tmp-promise';
import nodePandoc from 'node-pandoc';
import AWS from 'aws-sdk';

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

AWS.config.setPromisesDependency(Promise);
const s3bucket = new AWS.S3({ params: { Bucket: 'assets.pubpub.org' } });

tmp.setGracefulCleanup();

const isPubPubProduction = !!process.env.PUBPUB_PRODUCTION;
const dataRoot = process.env.NODE_ENV === 'production' ? '/app/.apt/usr/share/pandoc/data ' : '';

const findUrlForReferencedFile = (sourceFiles, targetPath, resourceRelativePath) => {
	// First, try to find a file in the uploads with the exact relative path
	const targetContainer = path.dirname(targetPath);
	for (const { localPath, url } of sourceFiles) {
		if (resourceRelativePath === path.relative(targetContainer, localPath)) {
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

const streamS3UrlToTmpFile = (sourceUrl) =>
	new Promise(async (resolve, reject) => {
		const tmpFile = await tmp.file({ extension: '.' + extensionFor(sourceUrl) });
		console.log('TMP FILE FOR URL', sourceUrl, tmpFile);
		const writeStream = fs.createWriteStream(tmpFile.path);
		s3bucket
			.getObject({ Key: sourceUrl.replace('https://assets.pubpub.org/', '') })
			.createReadStream()
			.on('end', () => {
				return resolve(tmpFile);
			})
			.on('error', (error) => {
				return reject(error);
			})
			.pipe(writeStream);
	});

const createPandocArgs = (pandocFormat, mediaDirPath, bibliographyPath) => {
	return [
		[`--data-dir=${dataRoot}`],
		['-f', pandocFormat],
		['-t', 'json'],
		mediaDirPath && [`--extract-media=${mediaDirPath}`],
		bibliographyPath && [`--bibliography=${bibliographyPath}`],
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
			/* This callback is called multiple times */
			/* err is sent multiple times and includes warnings */
			/* So to check if the file generated, check the size */
			/* of the tmp file. */
			if (result && !err) {
				resolve(result);
			}
			if (result && err) {
				reject(new Error('Error in Pandoc'));
			}
		}),
	);

export default async (sourceFiles) => {
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
	const shouldExtractMedia = ['odt', 'docx', 'epub'].includes(pandocFormat);
	const mediaDir = shouldExtractMedia && (await tmp.dir());
	const documentFile = await streamS3UrlToTmpFile(document.url);
	const bibliographyFile = bibliography && (await streamS3UrlToTmpFile(bibliography.url));
	const pandocArgs = createPandocArgs(
		pandocFormat,
		mediaDir && mediaDir.path,
		bibliographyFile && bibliographyFile.path,
	);
	const pandocResult = await callPandoc(documentFile.path, pandocArgs);
	return pandocResult;
};
