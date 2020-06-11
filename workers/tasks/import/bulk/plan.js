import fs from 'fs-extra';
import path from 'path';
import YAML from 'yaml';

import { directiveFileSuffix } from './constants';

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
    ${directives.map((d) => `\t'${d.type}' in ${d.path}\n`)}`;
	throw new Error(message);
};

const getDirectiveFilePriority = (fileName) => {
	if (fileName.startsWith('community')) {
		return 0;
	}
	if (fileName.startsWith('collection')) {
		return 1;
	}
	if (fileName.startsWith('pub')) {
		return 2;
	}
	return 3;
};

const pathMatchesDirective = (filePath, directive) => {
	return filePath === directive.match;
};

const matchDirectivesToPath = (filePath, directives) => {
	const matchingDirectives = directives.filter((directive) =>
		pathMatchesDirective(filePath, directive),
	);
	if (matchingDirectives.length > 1) {
		const pub = matchingDirectives.find((d) => d.type === 'pub');
		const collection = matchingDirectives.find((d) => d.type === 'collection');
		if (pub && collection) {
			throwConflictingDirectiveError(pub, collection, filePath);
		}
	}
	return matchingDirectives;
};

const extractDirectives = (matchingPath, directivePath, directive) => {
	const directives = [{ ...directive, match: matchingPath, path: directivePath }];
	if (directive.files) {
		Object.entries(directive.files).forEach(([matchingSubPath, subdirective]) => {
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
	const directiveFiles = files
		.filter((fileName) => fileName.endsWith(directiveFileSuffix))
		.sort((a, b) => getDirectiveFilePriority(a) - getDirectiveFilePriority(b));
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
	const visitFile = (filePath, directives) => {
		const matchingDirectives = matchDirectivesToPath(filePath, directives);
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
		const plan = {
			path: directoryPath,
			type: 'directory',
			directives: matchDirectivesToPath(directoryPath, nextDirectives),
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
