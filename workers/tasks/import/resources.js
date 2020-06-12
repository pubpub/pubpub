/* eslint-disable no-restricted-syntax */
import path from 'path';

import { generateAssetKeyForFile, uploadFileToAssetStore } from './assetStore';
import { downloadRemoteUrlToTmpPath } from './download';

const getSourceFileForResource = (resourcePath, sourceFiles, document) => {
	// First, try to find a file in the uploads with the exact path
	for (const sourceFile of sourceFiles) {
		if (resourcePath === sourceFile.clientPath) {
			return sourceFile;
		}
	}
	// Then, try to find a file in the uploads with the same relative path
	const documentContainer = path.dirname(document.clientPath);
	for (const sourceFile of sourceFiles) {
		const relativePathWithExtension = path.relative(documentContainer, sourceFile.clientPath);
		const relativePathSansExtension = relativePathWithExtension
			.split('.')
			.slice(0, -1)
			.join('.');
		if (
			resourcePath === relativePathWithExtension ||
			resourcePath === relativePathSansExtension
		) {
			return sourceFile;
		}
	}
	// Having failed, just look for a source file with the same name as the requested file.
	const baseName = path.basename(resourcePath);
	for (const sourceFile of sourceFiles) {
		if (path.basename(sourceFile.clientPath) === baseName) {
			return sourceFiles;
		}
	}
	return null;
};

const uploadPendingSourceFile = async (sourceFile, newAssetKey) => {
	const { tmpPath, remoteUrl } = sourceFile;
	if (tmpPath) {
		await uploadFileToAssetStore(tmpPath, newAssetKey);
	} else if (remoteUrl) {
		const newTmpPath = await downloadRemoteUrlToTmpPath(remoteUrl);
		await uploadFileToAssetStore(newTmpPath, newAssetKey);
	}
	throw new Error('Pending source file must have a tmpPath or remoteUrl');
};

export const createResourceTransformer = ({ sourceFiles, document, bibliographyItems }) => {
	const warnings = [];
	const pendingUploadsMap = new Map();

	const getAssetKeyForLocalResource = (localResource) => {
		const sourceFile = getSourceFileForResource(localResource, sourceFiles, document);
		if (sourceFile) {
			if (sourceFile.assetKey) {
				return sourceFile.assetKey;
			}
			const newKey = generateAssetKeyForFile(sourceFile.clientPath);
			pendingUploadsMap.set(sourceFile, newKey);
			return newKey;
		}
		return null;
	};

	const getAssetKeyForRemoteUrl = (remoteUrl) => {
		const newKey = generateAssetKeyForFile(remoteUrl);
		const sourceFile = { remoteUrl: remoteUrl };
		pendingUploadsMap.set(sourceFile, newKey);
		return newKey;
	};

	const getResource = (resource, context) => {
		if (context === 'citation') {
			const item = bibliographyItems[resource];
			if (item) {
				return item;
			}
			warnings.push({ type: 'missingCitation', id: resource });
			return { structuredValue: '', unstructuredValue: '' };
		}
		if (context === 'image') {
			const isUrl = resource.startsWith('http://') || resource.startsWith('https://');
			const assetKey = isUrl
				? getAssetKeyForRemoteUrl(resource)
				: getAssetKeyForLocalResource(resource);
			if (assetKey) {
				return `https://assets.pubpub.org/${assetKey}`;
			}
			warnings.push({ type: 'missingImage', path: resource });
			return resource;
		}
		return resource;
	};

	const uploadPendingResources = () =>
		Promise.all(
			[...pendingUploadsMap.entries()].map(([sourceFile, newAssetKey]) =>
				uploadPendingSourceFile(sourceFile, newAssetKey).catch(() =>
					warnings.push({
						type: 'missingImage',
						path: sourceFile.tmpPath || sourceFile.remoteUrl,
					}),
				),
			),
		);

	return {
		getResource: getResource,
		getWarnings: () => warnings,
		uploadPendingResources: uploadPendingResources,
	};
};
