/* eslint-disable no-restricted-syntax */

import Cite from 'citation-js';
import { getNotesByKindFromDoc, jsonToNode } from 'components/Editor';
import crypto from 'crypto';
import { CitationStyle, FacetValue } from 'facets';
import fs from 'fs';
import path from 'path';
import { DocJson } from 'types';
import { CitationInlineStyleKind, CitationStyleKind, citationStyles } from 'utils/citations';
import { RenderedStructuredValue, StructuredValue } from 'utils/notes';
import { expiringPromise } from 'utils/promises';

/* Different styles available here: */
/* https://github.com/citation-style-language/styles */
const config = Cite.plugins.config.get('@csl');
citationStyles.forEach((style) => {
	const fileString = fs.readFileSync(
		// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
		path.join(__dirname, style.path !== '' ? style.path : null),
		{ encoding: 'utf8' },
	);
	config.templates.add(style.key, fileString);
});
/* Remove @else/url parser. See Freshdesk ticket #1308. Second term specifies sync/async component.  */
/* https://github.com/citation-js/citation-js/blob/master/packages/core/src/plugins/input/data.js#L90-L97 */
Cite.plugins.input.removeDataParser('@else/url', false);
Cite.plugins.input.removeDataParser('@else/url', true);

/* Set the user agent with a mailto to use Crossref's "polite" pool. */
/* https://www.crossref.org/blog/rebalancing-our-rest-api-traffic/ */
Cite.util.setUserAgent(
	'PubPub/6.0 (https://pubpub.org; mailto:dev@pubpub.org) Citation.js/0.7.11 Node.js/22.14.0',
);

const generateFallbackHash = (structuredValue: string) =>
	crypto.createHash('md5').update(structuredValue).digest('base64').substring(0, 10);

const extractAuthorFromApa = (apaStyleCitation: string) => {
	if (
		apaStyleCitation.charAt(0) === '(' &&
		apaStyleCitation.charAt(apaStyleCitation.length - 1) === ')'
	) {
		const resultWithoutParens = extractAuthorFromApa(apaStyleCitation.slice(1, -1));
		return `(${resultWithoutParens})`;
	}
	return apaStyleCitation.split(',').slice(0, -1).join('');
};

const getInlineCitation = (
	citationJson: any[],
	citationApa: string,
	inlineStyle: CitationInlineStyleKind,
	fallbackValue: string,
) => {
	if (inlineStyle === 'authorYear') {
		return citationApa;
	}
	if (inlineStyle === 'author') {
		return extractAuthorFromApa(citationApa);
	}
	if (inlineStyle === 'label') {
		return (citationJson[0] && citationJson[0]['citation-label']) || fallbackValue;
	}
	return null;
};

const getSingleCitationAsync = expiringPromise(
	async (structuredValue: string) => {
		return Cite.async(structuredValue);
	},
	{ timeout: 1000, throws: () => new Error('Citation data failed to load') },
);

const getSingleStructuredCitation = async (
	structuredInput: string,
	citationStyle: CitationStyleKind,
	inlineStyle: CitationInlineStyleKind,
) => {
	const fallbackValue = generateFallbackHash(structuredInput);
	try {
		const citationData = await getSingleCitationAsync(structuredInput);
		if (citationData) {
			const citationJson = citationData.format('data', { format: 'object' });
			const citationHtml = citationData.format('bibliography', {
				template: citationStyle,
				format: 'html',
				lang: 'en-US',
			});
			const citationApa = citationData.format('citation', {
				template: citationStyle === 'apa-7' ? 'apa-7' : 'apa',
				format: 'text',
				lang: 'en-US',
			});
			return {
				html: citationHtml,
				json: citationJson,
				inline: getInlineCitation(citationJson, citationApa, inlineStyle, fallbackValue),
			};
		}
		return {
			html: '',
			json: '',
			inline: inlineStyle === 'label' ? `(${fallbackValue})` : null,
		};
	} catch (err) {
		return {
			html: '<div>' + structuredInput + '</div>',
			json: 'Error',
			inline: inlineStyle === 'label' ? `(${fallbackValue})` : null,
		};
	}
};

function* iterStructuredValues(structuredValues: StructuredValue[], limit: number) {
	let offset = 0;
	while (true) {
		const slice = structuredValues.slice(offset, offset + limit);
		yield slice;
		if (slice.length < limit) break;
		offset += limit;
	}
}

export const getStructuredCitations = async (
	structuredValues: StructuredValue[],
	citationStyle: CitationStyleKind = 'apa-7',
	inlineStyle: CitationInlineStyleKind = 'count',
) => {
	const structuredCitationsMap: Record<StructuredValue, RenderedStructuredValue> = {};
	const renderedStructuredValues: RenderedStructuredValue[] = [];
	// Some Pubs have many (100+) citations, so we batch the `Cite.async` calls
	// to avoid timeouts.
	for (const structuredValueSlice of iterStructuredValues(structuredValues, 10)) {
		// eslint-disable-next-line no-await-in-loop
		const renderedStructuredValuesSlice = await Promise.all(
			structuredValueSlice.map((structuredValue) =>
				getSingleStructuredCitation(structuredValue, citationStyle, inlineStyle),
			),
		);
		for (const renderedStructuredValue of renderedStructuredValuesSlice) {
			renderedStructuredValues.push(renderedStructuredValue);
		}
	}
	structuredValues.forEach((structuredValue, index) => {
		structuredCitationsMap[structuredValue] = renderedStructuredValues[index];
	});
	return structuredCitationsMap;
};

export const getStructuredCitationsForPub = (
	citationStyleFacet: FacetValue<typeof CitationStyle>,
	pubDoc: DocJson,
) => {
	const pubDocNode = jsonToNode(pubDoc);
	const { citationStyle = 'apa-7', inlineCitationStyle = 'count' } = citationStyleFacet;
	const { footnotes, citations } = getNotesByKindFromDoc(pubDocNode);
	const structuredValuesInDoc = [
		...new Set([...footnotes, ...citations].map((note) => note.structuredValue)),
	];
	return getStructuredCitations(structuredValuesInDoc, citationStyle, inlineCitationStyle);
};

export const getPathToCslFileForCitationStyleKind = (kind: CitationStyleKind) => {
	const citationStyle = citationStyles.find((style) => style.key === kind);
	if (citationStyle && citationStyle.path) {
		return path.join(__dirname, citationStyle.path);
	}
	return null;
};
