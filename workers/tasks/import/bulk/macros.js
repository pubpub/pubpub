/* eslint-disable no-restricted-syntax, no-loop-func, no-param-reassign */
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import { extensionFor } from '../util';

const isConcatableFile = (sourceFile) =>
	['document', 'supplement', 'preamble'].includes(sourceFile.label);

const asArray = (something) => (Array.isArray(something) ? something : [something]);

const interpolateString = (string, definitions, positionalArgs) =>
	string
		.replace(/\$\{(.*?)\}/g, (_, inner) => {
			const lookupKey = interpolateString(inner, definitions, positionalArgs);
			return definitions[lookupKey] || '';
		})
		.replace(/\$([0-9]+)/g, (_, position) => positionalArgs[parseInt(position, 10)]);

const transformSourceWithMacros = (sourceText, compiledMacros, definitions) => {
	for (const macro of compiledMacros) {
		const { regex, transformations } = macro;
		sourceText = sourceText.replace(regex, (match, ...rest) => {
			const parts = rest.slice(0, rest.length - 2);
			let returnValue = match;
			transformations.forEach((transformation) => {
				const interpolateArgs = [definitions, [match, ...parts]];
				if (typeof transformation === 'string') {
					returnValue = interpolateString(returnValue, ...interpolateArgs);
				} else if (transformation.define) {
					const [rawKey, rawValue] = transformation.define;
					const key = interpolateString(rawKey, ...interpolateArgs);
					const value = interpolateString(rawValue, ...interpolateArgs);
					definitions[key] = value;
				}
			});
			return returnValue;
		});
	}
	return sourceText;
};

const compileMacros = (macros) => {
	const compiledMacros = [];
	Object.entries(macros).forEach(([regexStr, transformations]) => {
		const regex = new RegExp(regexStr, 'g');
		compiledMacros.push({ regex: regex, transformations: asArray(transformations) });
	});
	return compiledMacros;
};

export const runMacrosOnSourceFiles = async (sourceFiles, macros, maxLoopsPermitted = 10) => {
	const definitions = {};
	const compiledMacros = compileMacros(macros);
	const concatableFiles = sourceFiles.filter(isConcatableFile);
	const document = concatableFiles.find((file) => file.label === 'document');
	let sourceText = await Promise.all(
		concatableFiles.map((file) => fs.readFile(file.tmpPath)),
	).then((buffs) => buffs.map((buff) => buff.toString()).join('\n\n'));
	let loopCount = 0;
	do {
		const nextSourceText = transformSourceWithMacros(sourceText, compiledMacros, definitions);
		const terminated = nextSourceText === sourceText;
		sourceText = nextSourceText;
		++loopCount;
		if (terminated) {
			break;
		} else if (loopCount > maxLoopsPermitted) {
			throw new Error(
				`Exceeded maximum loop count of ${maxLoopsPermitted} while expanding macros`,
			);
		}
		console.log(sourceText);
	// eslint-disable-next-line no-constant-condition
	} while (true);
	const { path: tmpPath } = await tmp.file({ postfix: `.${extensionFor(document.tmpPath)}` });
	await fs.writeFileSync(tmpPath, sourceText);
	return [
		{ tmpPath: tmpPath, label: 'document' },
		...sourceFiles.filter((file) => !concatableFiles.includes(file)),
	];
};
