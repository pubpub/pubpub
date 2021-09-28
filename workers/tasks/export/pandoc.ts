import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
import nodePandoc from 'node-pandoc';
import { FileResult } from 'tmp-promise';
import { fromProsemirror, emitPandocJson } from '@pubpub/prosemirror-pandoc';

import { getLicenseBySlug } from 'utils/licenses';
import { DocJson } from 'types';

import { rules } from '../import/rules';
import { getTmpFileForExtension } from './util';
import { NotesData, PubMetadata } from './types';
import {
	getPandocNotesByHash,
	getReferencesEntryForPandocNotes,
	getHashForNote,
	PandocNotes,
} from './notes';

const formatToTemplateExtension = {
	epub: 'epub3',
};

const getTemplatePath = (pandocTarget) => {
	const targetExtension = formatToTemplateExtension[pandocTarget] || pandocTarget;
	return path.join(__dirname, 'templates', `default.${targetExtension}`);
};

const createPandocArgs = (pandocTarget, tmpFile, metadataFile) => {
	// pandoc inexplicably does not include a default template for docx or odt
	const template = pandocTarget !== 'docx' && pandocTarget !== 'odt' && pandocTarget !== 'json';
	return [
		['-f', 'json'],
		['-t', pandocTarget],
		['-o', tmpFile.path],
		template && [`--template=${getTemplatePath(pandocTarget)}`],
		metadataFile && [`--metadata-file=${metadataFile.path}`],
		['--citeproc'],
	]
		.filter((x): x is string[] => !!x)
		.reduce((acc, next) => [...acc, ...next], []);
};

const createYamlMetadataFile = async (
	pubMetadata: PubMetadata,
	pandocNotes: PandocNotes,
	pandocTarget: string,
) => {
	const {
		title,
		attributions,
		publishedDateString,
		licenseSlug,
		primaryCollectionMetadata,
		communityTitle,
		doi,
	} = pubMetadata;
	const license = getLicenseBySlug(licenseSlug)!;
	const formattedAttributions = attributions.map((attr) => {
		if (pandocTarget === 'jats_archiving') {
			const publicEmail = 'publicEmail' in attr.user ? attr.user.publicEmail : null;
			return {
				...(attr.user.lastName && { surname: attr.user.lastName }),
				...(attr.user.firstName && { 'given-names': attr.user.firstName }),
				...(publicEmail && { email: publicEmail }),
				...(attr.user.orcid && { orcid: attr.user.orcid }),
			};
		}
		return attr.user.fullName;
	});
	const metadata = YAML.stringify({
		title,
		author: formattedAttributions,
		...(publishedDateString && { date: publishedDateString }),
		journal: {
			title: communityTitle,
		},
		copyright: {
			text: license.full,
			type: license.short,
			...(license.link && { link: license.link }),
		},
		...(primaryCollectionMetadata && {
			article: {
				...(primaryCollectionMetadata.issue && { issue: primaryCollectionMetadata.issue }),
				...(primaryCollectionMetadata.volume && {
					volume: primaryCollectionMetadata.volume,
				}),
				...(doi && { doi }),
			},
		}),
		references: getReferencesEntryForPandocNotes(pandocNotes),
	});
	const file = await getTmpFileForExtension('yaml');
	fs.writeFileSync(file.path, metadata);
	return file;
};

const createResourceTransformer = (pandocNotes: PandocNotes) => {
	return (input: any, context?: string) => {
		if (context === 'citation') {
			const { value: structuredValue, unstructuredValue } = input;
			const hash = getHashForNote({ structuredValue, unstructuredValue });
			return pandocNotes[hash];
		}
		return input;
	};
};

type CallPandocOptions = {
	pubDoc: DocJson;
	pandocTarget: string;
	pubMetadata: PubMetadata;
	tmpFile: FileResult;
	notesData: NotesData;
};

export const callPandoc = async (options: CallPandocOptions) => {
	const { pubDoc, pandocTarget, pubMetadata, tmpFile, notesData } = options;
	const pandocNotes = getPandocNotesByHash(
		notesData.citations,
		notesData.renderedStructuredValues,
	);
	const metadataFile = await createYamlMetadataFile(pubMetadata, pandocNotes, pandocTarget);
	const args = createPandocArgs(pandocTarget, tmpFile, metadataFile);
	const pandocAst = fromProsemirror(pubDoc, rules, {
		prosemirrorDocWidth: 675,
		resource: createResourceTransformer(pandocNotes),
	}).asNode();
	const pandocJsonString = JSON.stringify(emitPandocJson(pandocAst));
	return new Promise((resolve, reject) => {
		nodePandoc(pandocJsonString, args, (err, result) => {
			if (err && err.message) {
				console.warn(err.message);
			}
			/* This callback is called multiple times */
			/* err is sent multiple times and includes warnings */
			/* So to check if the file generated, check the size */
			/* of the tmp file. */
			const wroteToFile = !!fs.statSync(tmpFile.path).size;
			if (result && wroteToFile) {
				resolve(result);
			}
			if (result && !wroteToFile) {
				reject(new Error('Error in Pandoc'));
			}
		});
	});
};
