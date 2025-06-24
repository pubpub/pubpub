/* eslint-disable import/prefer-default-export */
import Cite from 'citation-js';

import * as types from 'types';
import { pubUrl } from 'utils/canonicalUrls';
import { CitationStyleKind, renderJournalCitationForCitations } from 'utils/citations';
import getCollectionDoi from 'utils/collections/getCollectionDoi';
import { getPrimaryCollection } from 'utils/collections/primary';
import { getAllPubContributors } from 'utils/contributors';
import { getPubPublishedDate } from 'utils/pub/pubDates';

const getDatePartsObject = (date) => ({
	'date-parts': [date.getFullYear(), date.getMonth() + 1, date.getDate()],
});

const collectionKindToCitationJSPart = (kind) =>
	({
		book: 'chapter',
		conference: 'paper-conference',
		issue: 'article-journal',
	})[kind] || 'article-journal';

const getCollectionLevelData = (collection) => {
	if (!collection) {
		return { type: 'article-journal' };
	}
	const { kind, title } = collection;
	const metadata = collection.metadata || {};
	const useCollectionTitle = collection.kind !== 'issue';
	return {
		type: collectionKindToCitationJSPart(kind),
		...(useCollectionTitle && { 'container-title': title }),
		containerDoi: getCollectionDoi(collection),
		ISBN: metadata.isbn,
		ISSN: metadata.issn || metadata.printIssn || metadata.electronicIssn,
		edition: metadata.edition,
		volume: metadata.volume,
		issue: metadata.issue,
	};
};

const getContributorName = (attribution: types.Attribution, index, arr, hideNonAuthors = false) =>
	(types.isCollectionAttribution(attribution) || types.isPubAttribution(attribution)) &&
	(hideNonAuthors ? attribution.isAuthor : true) &&
	attribution.user
		? { given: attribution.user.firstName, family: attribution.user.lastName }
		: {};

export const generateCitationHtml = async (
	pubData: types.SanitizedPubData,
	communityData: types.Community,
	citationStyle: CitationStyleKind,
) => {
	// TODO: We need to set the updated times properly, which are likely stored in firebase.
	const pubIssuedDate = getPubPublishedDate(pubData);
	const pubLink = pubUrl(communityData, pubData);
	const primaryCollection = getPrimaryCollection(pubData.collectionPubs);
	const authors = getAllPubContributors(pubData, 'author').map((contributor, index, array) =>
		getContributorName(contributor, index, array, true),
	);
	const authorEntry = authors.length ? { author: authors } : {};

	const editors = getAllPubContributors(pubData, 'editor').map(getContributorName);
	const editorEntry = editors.length ? { editor: editors } : {};

	const illustrators = getAllPubContributors(pubData, 'illustrator').map(getContributorName);
	const illustratorEntry = illustrators.length ? { illustrator: illustrators } : {};

	const translators = getAllPubContributors(pubData, 'Translator').map(getContributorName);
	const translatorEntry = translators.length ? { translator: translators } : {};

	const collectionEditors = getAllPubContributors(pubData, 'Series Editor').map(
		getContributorName,
	);
	const collectionEditorEntry = collectionEditors.length
		? { 'collection-editor': collectionEditors }
		: {};

	const chairs = getAllPubContributors(pubData, 'Chair').map(getContributorName);
	const chairEntry = chairs.length ? { chair: chairs } : {};

	const commonData = {
		// @ts-expect-error ts-migrate(2783) FIXME: 'type' is specified more than once, so this usage ... Remove this comment to see the full error message
		type: 'article-journal',
		title: pubData.title,
		...authorEntry,
		...editorEntry,
		...illustratorEntry,
		...collectionEditorEntry,
		...chairEntry,
		...translatorEntry,
		...renderJournalCitationForCitations(
			primaryCollection?.kind,
			communityData.citeAs,
			communityData.title,
		),
		...getCollectionLevelData(primaryCollection),
		publisher: communityData.publishAs || '',
	};

	/* Set the user agent with a mailto to use Crossref's "polite" pool. */
	/* https://www.crossref.org/blog/rebalancing-our-rest-api-traffic/ */
	Cite.util.setUserAgent(
		'PubPub/6.0 (https://pubpub.org; mailto:dev@pubpub.org) Citation.js/0.7.11 Node.js/22.14.0',
	);

	const pubCiteObject = await Cite.async({
		...commonData,
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'containerDoi' does not exist on type '{ ... Remove this comment to see the full error message
		DOI: pubData.doi || commonData.containerDoi,
		ISSN: pubData.doi ? communityData.issn : null,
		issued: pubIssuedDate && [getDatePartsObject(pubIssuedDate)],
		note: pubLink,
		URL: pubLink,
	});
	return {
		pub: {
			default: pubCiteObject
				.format('bibliography', {
					format: 'html',
					template: citationStyle,
					lang: 'en-US',
				})
				.replace(/\n/gi, ''),
			apa: pubCiteObject
				.format('bibliography', { format: 'html', template: 'apa-7', lang: 'en-US' })
				.replace(/\n/gi, ''),
			harvard: pubCiteObject
				.format('bibliography', { format: 'html', template: 'harvard', lang: 'en-US' })
				.replace(/\n/gi, ''),
			vancouver: pubCiteObject
				.format('bibliography', { format: 'html', template: 'vancouver', lang: 'en-US' })
				.replace(/\n/gi, ''),
			bibtex: pubCiteObject.format('bibtex'),
		},
	};
};
