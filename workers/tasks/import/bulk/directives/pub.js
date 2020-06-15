/* eslint-disable no-restricted-syntax */
import fs from 'fs-extra';
import path from 'path';
import YAML from 'yaml';
import tmp from 'tmp-promise';
import { Node, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';

import { buildSchema, createFirebaseChange } from 'components/Editor/utils';
import { getBranchRef } from 'server/utils/firebaseAdmin';
import { createPub as createPubQuery } from 'server/pub/queries';
import { createCollectionPub } from 'server/collectionPub/queries';
import { Branch, PubAttribution } from 'server/models';
import { extensionToPandocFormat, bibliographyFormats } from 'shared/import/formats';

import { getFullPathsInDir, extensionFor } from '../../util';
import { importFiles } from '../../import';
import { BulkImportError } from '../errors';
import { getAttributionAttributes, cloneWithKeys } from './util';

const pubAttributesFromMetadata = ['title', 'description'];
const pubAttributesFromDirective = ['title', 'description', 'slug'];
const documentExtensions = Object.keys(extensionToPandocFormat);
const documentSchema = buildSchema();

const getSourcesForMetadataStrategy = (directive) => {
	const { metadataStrategy: strategy } = directive;
	if (!strategy || strategy === 'merge') {
		return { import: true, directive: true };
	}
	if (strategy === 'import') {
		return { import: true };
	}
	if (strategy === 'directive') {
		return { directive: true };
	}
	throw new BulkImportError(
		{ directive: directive },
		`Invalid metadataStrategy ${strategy}. Must be one of "merge", "import", "directive"`,
	);
};

const createPubAttributions = async (pub, proposedMetadata, directive) => {
	const { attributions: proposedAttributions = [] } = proposedMetadata;
	const { matchSlugsToAttributions = [] } = directive;
	const sources = getSourcesForMetadataStrategy(directive);
	let attributionsAttrs = [];
	if (sources.import) {
		const matchedProposedAttributions = proposedAttributions.map(({ name, users }) => {
			const matchedUser = users.find((user) => matchSlugsToAttributions.includes(user.slug));
			const userId = matchedUser && matchedUser.id;
			return { name: name, userId: userId };
		});
		attributionsAttrs = [...attributionsAttrs, ...matchedProposedAttributions];
	}
	if (sources.directive && Array.isArray(directive.attributions)) {
		attributionsAttrs = [...attributionsAttrs, ...directive.attributions];
	}
	await Promise.all(
		attributionsAttrs.map(async (attrDirective, index, { length }) => {
			const resolvedAttrs = await getAttributionAttributes(attrDirective);
			return PubAttribution.create({
				pubId: pub.id,
				order: 1 / 2 ** (length - index),
				...resolvedAttrs,
			});
		}),
	);
};

const createPub = (communityId, directive, proposedMetadata) => {
	const sources = getSourcesForMetadataStrategy(directive);
	const attributes = {
		communityId: communityId,
		...(sources.import && cloneWithKeys(proposedMetadata, pubAttributesFromMetadata)),
		...(sources.directive && cloneWithKeys(directive, pubAttributesFromDirective)),
	};
	return createPubQuery(attributes);
};

const gatherLocalSourceFilesForPub = async (targetPath, isTargetDirectory) => {
	if (isTargetDirectory) {
		return getFullPathsInDir(targetPath).map((tmpPath) => {
			return { tmpPath: tmpPath, clientPath: path.relative(targetPath, path) };
		});
	}
	return [{ tmpPath: targetPath, clientPath: path.basename(targetPath) }];
};

const gatherNonLocalSourceFilesForPub = async (targetPath, isTargetDirectory, directive) => {
	const { resolve: sources } = directive;

	if (!sources) {
		return [];
	}

	const fullPathToTargetDirectory = isTargetDirectory ? targetPath : path.dirname(targetPath);

	const getRelativePathAndOptions = (entry) => {
		if (typeof entry === 'string') {
			return { pathToEntrypoint: entry, options: {} };
		}
		const [[relativePathToEntrypoint, options]] = Object.entries(entry);
		return { relativePathToEntrypoint: relativePathToEntrypoint, options: options };
	};

	const resolveEntry = async (entry) => {
		const { relativePathToEntrypoint, options } = getRelativePathAndOptions(entry);
		const fullPathToEntrypoint = path.join(fullPathToTargetDirectory, relativePathToEntrypoint);
		const stat = await fs.stat(fullPathToEntrypoint);

		const resolveFile = (fullPathToFile) => {
			const { as, into, label } = options;
			if (as) {
				return { tmpPath: fullPathToFile, clientPath: as, label: label };
			}
			const pathFromEntrypointToFile = path.relative(fullPathToEntrypoint, fullPathToFile);
			const clientPath = into
				? path.join(into, pathFromEntrypointToFile)
				: relativePathToEntrypoint;
			return { tmpPath: fullPathToFile, clientPath: clientPath, label: label };
		};

		if (stat.isDirectory()) {
			return getFullPathsInDir(fullPathToEntrypoint).map(resolveFile);
		}
		return [resolveFile(fullPathToEntrypoint)];
	};

	return Promise.all(sources.map(resolveEntry)).then((arr) =>
		arr.reduce((a, b) => [...a, ...b], []),
	);
};

const labelGatheredSourceFiles = (sourceFiles, directive) => {
	const {
		labels: {
			document: documentPath,
			bibliography: bibliographyPath,
			supplements: supplementPaths = [],
		} = {},
	} = directive;
	let hasDocument = sourceFiles.some((file) => file.label === 'document');
	let hasBibliography = sourceFiles.some((file) => file.label === 'bibliography');
	const labelledFiles = [];
	for (const sourceFile of sourceFiles) {
		const { clientPath } = sourceFile;
		const extension = extensionFor(clientPath);
		if (
			!hasDocument &&
			(!documentPath || documentPath === clientPath) &&
			documentExtensions.includes(extension)
		) {
			hasDocument = true;
			labelledFiles.push({ ...sourceFile, label: 'document' });
		} else if (
			!hasBibliography &&
			(!bibliographyPath || bibliographyPath === clientPath) &&
			bibliographyFormats.includes(extension)
		) {
			hasBibliography = true;
			labelledFiles.push({ ...sourceFile, label: 'bibliography' });
		} else if (supplementPaths.includes(clientPath)) {
			labelledFiles.push({ ...sourceFile, label: 'supplement' });
		} else {
			labelledFiles.push(sourceFile);
		}
	}
	return labelledFiles;
};

const createPreambleFiles = async (directive) => {
	const { preamble, pandocMetadata } = directive;
	let pandocMetadataFile;
	let preambleFile;
	if (pandocMetadata) {
		const metadata = YAML.stringify(pandocMetadata);
		const contents = `---\n${metadata}\n---`;
		const { path: tmpPath } = await tmp.file();
		await fs.writeFile(tmpPath, contents);
		pandocMetadataFile = { tmpPath: tmpPath, label: 'preamble' };
	}
	if (preamble) {
		const { path: tmpPath } = await tmp.file();
		await fs.writeFile(tmpPath, preamble);
		preambleFile = { tmpPath: tmpPath, label: 'preamble' };
	}
	return [pandocMetadataFile, preambleFile].filter((x) => x);
};

const getImportableFiles = async (directive, targetPath) => {
	const stat = await fs.lstat(targetPath);
	const isTargetDirectory = stat.isDirectory();
	const localFiles = await gatherLocalSourceFilesForPub(targetPath, isTargetDirectory);
	const nonLocalFiles = await gatherNonLocalSourceFilesForPub(
		targetPath,
		isTargetDirectory,
		directive,
	);
	const gatheredSourceFiles = [...localFiles, ...nonLocalFiles];
	const sourceFiles = labelGatheredSourceFiles(gatheredSourceFiles, directive);
	const preambleFiles = await createPreambleFiles(directive);
	return [...preambleFiles, ...sourceFiles];
};

const writeDocumentToPubDraft = async (pubId, document) => {
	const draftBranch = await Branch.findOne({ where: { pubId: pubId, title: 'draft' } });
	const branchRef = getBranchRef(pubId, draftBranch.id);
	const hydratedDocument = Node.fromJSON(documentSchema, document);
	const documentSlice = new Slice(Fragment.from(hydratedDocument.content), 0, 0);
	const replaceStep = new ReplaceStep(0, 0, documentSlice);
	const change = createFirebaseChange([replaceStep], draftBranch.id, 'bulk-importer');
	await branchRef
		.child('changes')
		.child(0)
		.set(change);
};

export const resolvePubDirective = async ({ directive, targetPath, community, collection }) => {
	const { importerFlags = {}, resourceReplacements = {} } = directive;
	const sourceFiles = await getImportableFiles(directive, targetPath);
	const tmpDir = await tmp.dir();
	const { doc, warnings, proposedMetadata } = await importFiles({
		tmpDirPath: tmpDir.path,
		sourceFiles: sourceFiles,
		importerFlags: importerFlags,
		resourceReplacements: resourceReplacements,
	});
	const pub = await createPub(community.id, directive, proposedMetadata);
	await createPubAttributions(pub, proposedMetadata, directive);
	await writeDocumentToPubDraft(pub.id, doc);
	if (collection) {
		await createCollectionPub({ collectionId: collection.id, pubId: pub.id, isPrimary: true });
	}
	return {
		pub: pub,
		warnings: warnings,
		created: true,
	};
};
