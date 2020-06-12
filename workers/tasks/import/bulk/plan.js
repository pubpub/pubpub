import fs from 'fs-extra';
import path from 'path';
import YAML from 'yaml';

import { directiveFileSuffix } from './constants';

const zipArrays = (first, second) => {
	const length = Math.max(first.length, second.length);
	const firstFilled = [...first, ...new Array(length - first.length).fill(null)];
	const secondFilled = [...second, ...new Array(length - second.length).fill(null)];
	const res = [];
	for (let i = 0; i < length; i++) {
		res.push([firstFilled[i], secondFilled[i]]);
	}
	return res;
};

const throwConflictingDirectiveError = (first, second, filePath) => {
	const message = `
        Found conflicting directive types for ${filePath}:
            '${first.type}' in ${first.path}
            '${second.type}' in ${second.path}
    `;
	throw new Error(message);
};

const throwInvalidDirectiveTypeError = (directives, allowedTypes, filePath) => {
	const message = `
    Found invalid directive types for ${filePath} (expected ${allowedTypes.map((t) => `'${t}'`)}):
    ${directives.map((d) => `\t'${d.type}' in ${d.path}`).join('\n')}`;
	throw new Error(message);
};

const maybeThrowNestedCollectionError = (parentDirectives, matchedDirectives) => {
	const parentCollection = parentDirectives.find((d) => d.type === 'collection');
	const matchedCollection = matchedDirectives.find((d) => d.type === 'collection');
	if (parentCollection && matchedCollection) {
		const message = `
        Found illegally nested collection diretives:
            in ${parentCollection.path}
            in ${matchedCollection.path}
        `;
		throw new Error(message);
	}
};

const checkAllFilesExistForPubDirective = async (directive, directoryPath) => {
	const { files } = directive;
	if (!files) {
		return;
	}
	const stat = await fs.lstat(directoryPath);
	if (!stat.isDirectory()) {
		throw new Error(
			`Directive ${directive.$meta.source} with 'files' key must target a directory, not a file.`,
		);
	}
	const { document, bibliography, supplements = [] } = files;
	const pathsToCheck = [document, bibliography, ...supplements];
	const missingFiles = await Promise.all(
		pathsToCheck
			.filter((x) => x)
			.map(async (filePath) => {
				const exists = await fs.exists(path.join(directoryPath, filePath));
				if (exists) {
					return null;
				}
				return filePath;
			}),
	).then((res) => res.filter((x) => x));
	if (missingFiles.length > 0) {
		throw new Error(
			`
            Directive ${directive.$meta.source} refers to 'files' that do not exist:
            ${missingFiles.join('\t')}`,
		);
	}
};

const checkDirectiveForRequiredKeys = (directive) => {
	const { type, title, create, slug, subdomain } = directive;
	if (type === 'pub') {
		return;
	}
	if (create && !title) {
		throw new Error(
			`Directive ${directive.$meta.source} would create a new ${type} and requires a 'title'`,
		);
	}
	if (type === 'community' && !create && !subdomain) {
		throw new Error(
			`Directive ${directive.$meta.source} will look up a Community and requires a 'subdomain'.` +
				` Specify 'create: true' to create a new Community instead.`,
		);
	}
	if (type === 'collection' && !create && !slug) {
		throw new Error(
			`Directive ${directive.$meta.source} will look up a Collection and requires a 'slug'.` +
				` Specify 'create: true' to create a new Collection instead.`,
		);
	}
};

const pathMatchesDirective = (filePath, directive) => {
	const {
		$meta: { merged, match, source },
	} = directive;
	if (merged) {
		throw new Error(`Cannot match against directive ${source}`);
	}
	const filePathParts = filePath.split('/');
	const matchParts = match.split('/');
	return zipArrays(matchParts, filePathParts).every(([pathPart, matchPart]) => {
		if (pathPart === null || matchPart === null) {
			return false;
		}
		const pathDotSegments = pathPart.split('.');
		const matchDotSegments = matchPart.split('.');
		return zipArrays(matchDotSegments, pathDotSegments).every(
			([pathSegment, matchSegment]) => pathSegment === matchSegment || matchSegment === '*',
		);
	});
};

const mergeDirectives = (directives) => {
	if (directives.length <= 1) {
		return directives;
	}
	const $meta = {
		// Take `name` from the directive closest to its target in the filesystem
		name: directives[directives.length - 1].$meta.name,
		source: `merged from ${directives.map((d) => d.$meta.source).join(', ')}`,
		merged: directives,
	};
	return [
		{
			...directives.reduce((a, b) => ({ ...a, ...b }), {}),
			$meta: $meta,
		},
	];
};

const mergeDirectivesByType = (directives) => {
	const pubs = directives.filter((d) => d.type === 'pub');
	const collections = directives.filter((d) => d.type === 'collection');
	const communities = directives.filter((d) => d.type === 'community');
	// Scope order is important to maintain here, so that we can specify higher scopes and lower
	// scopes in the same directory, and they will be resolved in the right order.
	return [
		...mergeDirectives(communities),
		...mergeDirectives(collections),
		...mergeDirectives(pubs),
	];
};

const matchDirectivesToPath = async (filePath, directives) => {
	const matchingDirectives = directives.filter((directive) =>
		pathMatchesDirective(filePath, directive),
	);
	matchingDirectives.forEach(checkDirectiveForRequiredKeys);
	if (matchingDirectives.length > 1) {
		const pub = matchingDirectives.find((d) => d.type === 'pub');
		const collection = matchingDirectives.find((d) => d.type === 'collection');
		if (pub && collection) {
			throwConflictingDirectiveError(pub, collection, filePath);
		}
	}
	await Promise.all(
		matchingDirectives.map((directive) =>
			checkAllFilesExistForPubDirective(directive, filePath),
		),
	);
	return mergeDirectivesByType(matchingDirectives);
};

const extractDirectives = (matchingPath, directivePath, directive) => {
	if (!directive) {
		return [];
	}
	if (directive && !directive.type) {
		throw new Error(
			`${directivePath} must specify a type: 'pub', 'collection', or 'community'`,
		);
	}
	const directives = [
		{
			...directive,
			$meta: {
				source: directivePath,
				match: matchingPath,
				name: path.basename(matchingPath),
			},
		},
	];
	if (directive.children) {
		Object.entries(directive.children).forEach(([matchingSubPath, subdirective]) => {
			directives.push(
				...extractDirectives(
					`${matchingPath}/${matchingSubPath}`,
					directivePath,
					subdirective,
				),
			);
		});
	}
	return directives;
};

const getDirectivesFromFiles = async (directory, files) => {
	const directiveFiles = files.filter((fileName) => fileName.endsWith(directiveFileSuffix));
	const directives = await Promise.all(
		directiveFiles.map(async (fileName) => {
			const directivePath = path.join(directory, fileName);
			const contents = await fs.readFile(directivePath);
			const directive = YAML.parse(contents.toString());
			return extractDirectives(directory, directivePath, directive);
		}),
	).then((res) => res.reduce((a, b) => [...a, ...b], []));
	return { directiveFiles: directiveFiles, directives: directives };
};

export const buildImportPlan = (rootDirectory) => {
	const visitFile = async (filePath, directives) => {
		const matchingDirectives = await matchDirectivesToPath(filePath, directives);
		const invalidDirectives = matchingDirectives.filter((d) => d.type !== 'pub');
		if (invalidDirectives.length > 0) {
			throwInvalidDirectiveTypeError(invalidDirectives, ['pub'], filePath);
		}
		if (matchingDirectives) {
			return {
				path: filePath,
				type: 'file',
				directives: matchingDirectives,
			};
		}
		return null;
	};

	const visitDirectory = async (directoryPath, parentDirectives = []) => {
		const files = await fs.readdir(directoryPath);
		const { directives, directiveFiles } = await getDirectivesFromFiles(directoryPath, files);
		const nextDirectives = [...parentDirectives, ...directives];
		const matchedDirectives = await matchDirectivesToPath(directoryPath, nextDirectives);
		maybeThrowNestedCollectionError(parentDirectives, matchedDirectives);
		const plan = {
			path: directoryPath,
			type: 'directory',
			directives: matchedDirectives,
		};
		const childPlans = await Promise.all(
			files
				.filter((f) => !directiveFiles.includes(f))
				.map(async (filePath) => {
					const fullPath = path.join(directoryPath, filePath);
					const stat = await fs.lstat(fullPath);
					if (stat.isDirectory()) {
						return visitDirectory(fullPath, nextDirectives);
					}
					return visitFile(fullPath, nextDirectives);
				}),
		).then((arr) => arr.filter((x) => x));
		if (childPlans.length > 0) {
			return { ...plan, children: childPlans };
		}
		return plan;
	};

	return visitDirectory(rootDirectory);
};

export const printImportPlan = (importPlan, depth = 0) => {
	const { directives, children } = importPlan;
	const prefix = ' '.repeat(depth * 4);
	const indent = '  ';

	const childResults = (children || [])
		.map((child) => printImportPlan(child, depth + 1))
		.join('');

	const shouldPrint = directives.length > 0 || childResults;

	if (!shouldPrint) {
		return '';
	}

	const lines = [];
	const log = (str) => {
		lines.push(str);
	};

	log(`${prefix}[${importPlan.type}] ${importPlan.path}`);

	if (directives.length > 0) {
		directives.forEach((directive) => {
			const { type, create, slug, subdomain, title } = directive;
			const sharedPrefix = `${prefix}${indent}`;
			if (type === 'pub') {
				const effectiveTitle = title || '(derived)';
				log(`${sharedPrefix}NEW PUB title=${effectiveTitle}`);
			}
			if (type === 'collection') {
				const specifier = create
					? `NEW COLLECTION title=${title}`
					: `EXISTING COLLECTION slug=${slug}`;
				log(`${sharedPrefix}${specifier}`);
			}
			if (type === 'community') {
				const specifier = create
					? `NEW COMMUNITY title=${title}`
					: `EXISTING COMMUNITY subdomain=${subdomain}`;
				log(`${sharedPrefix}${specifier}`);
			}
		});
	}
	log(childResults);
	const output = lines.join('\n');
	if (depth === 0) {
		// eslint-disable-next-line no-console
		console.log(output);
	}
	return output;
};
