import fs from 'fs';
import nodePandoc from 'node-pandoc';
import YAML from 'yaml';

import { isProd, isDuqDuq } from 'shared/utils/environment';
import { getLicenseBySlug } from 'shared/license';
import { getTmpFileForExtension } from './util';

const dataRoot =
	isProd() || isDuqDuq()
		? '/app/.apt/usr/share/pandoc/data'
		: '/usr/local/Cellar/pandoc/2.9.2.1/share/x86_64-osx-ghc-8.8.3/pandoc-2.9.2.1/data';

const createPandocArgs = (pandocTarget, tmpFile, metadataFile) => {
	const template = pandocTarget === 'jats_archiving';
	return [
		dataRoot && [`--data-dir=${dataRoot}`],
		['-f', 'html'],
		['-t', pandocTarget],
		['-o', tmpFile.path],
		template && [`--template=${dataRoot}/templates/default.${pandocTarget}`],
		// ['-D'],
		metadataFile && [`--metadata-file=${metadataFile.path}`],
	]
		.filter((x) => x)
		.reduce((acc, next) => [...acc, ...next], []);
};

const createYamlMetadataFile = async (
	{
		attributions,
		publishedDateString,
		licenseSlug,
		primaryCollectionTitle,
		primaryCollectionMetadata,
		communityTitle,
		doi,
	},
	pandocTarget,
) => {
	const license = getLicenseBySlug(licenseSlug);
	const formattedAttributions = attributions.map((attr) => {
		if (pandocTarget === 'jats_archiving') {
			return {
				surname: attr.user.lastName,
				'given-names': attr.user.firstName,
				email: attr.user.publicEmail,
				orcid: attr.user.orcid,
			};
		}
		return attr.user.fullName;
	});
	const metadata = YAML.stringify({
		author: formattedAttributions,
		...(publishedDateString && { date: publishedDateString }),
		journal: {
			title: communityTitle,
		},
		copyright: {
			text: license.full,
			type: license.short,
			link: license.link,
		},
		article: {
			issue: primaryCollectionTitle,
			doi: doi,
		},
	});
	console.log('metadata', primaryCollectionMetadata);
	const file = await getTmpFileForExtension('yaml');
	fs.writeFileSync(file.path, metadata);
	return file;
};

export const callPandoc = async ({ staticHtml, pandocTarget, pubMetadata, tmpFile }) => {
	const metadataFile = await createYamlMetadataFile(pubMetadata, pandocTarget);
	const args = createPandocArgs(pandocTarget, tmpFile, metadataFile);
	return new Promise((resolve, reject) => {
		nodePandoc(staticHtml, args, (err, result) => {
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
