/**
 * Code that builds a submission that we can send to Crossref. We build JSON here, and let that
 * get converted to equivalent XML downstream.
 */
import doiBatch from './schema/doiBatch';

import renderBook from './render/book';
import renderConference from './render/conference';
import renderJournal from './render/journal';
import createDoi from './createDoi';

const renderBody = (context) => {
	const { collection } = context;
	if (collection) {
		if (collection.kind === 'book') {
			return renderBook(context);
		}
		if (collection.kind === 'conference') {
			return renderConference(context);
		}
	}
	return renderJournal(context);
};

const getDois = (context) => {
	const { community, collection, pub } = context;
	return {
		collectionDoi: collection && createDoi({ community: community, collection: collection }),
		pubDoi: pub && createDoi({ community: community, collection: collection, pub: pub }),
		getPubVersionDoi:
			pub &&
			((version) =>
				createDoi({
					community: community,
					collection: collection,
					pub: pub,
					version: version,
				})),
	};
};

const postprocessJson = (json) => {
	const next = {};
	Object.keys(json).forEach((key) => {
		const value = json[key];
		if (Array.isArray(value)) {
			next[key] = value.map(postprocessJson);
		}
		if (typeof value === 'object') {
			next[key] = postprocessJson(value);
		}
		if (!(value === undefined || value === null)) {
			next[key] = value;
		}
	});
	return next;
};

export default ({ community, collection, pub }, issueOptions = {}) => {
	const { issuePubDoi = true, issueCollectionDoi = false } = issueOptions;
	const timestamp = new Date().getTime();
	const doiBatchId = `${timestamp}_${community.id.slice(0, 8)}`;
	const dois = getDois({
		community: community,
		collection: issueCollectionDoi && collection,
		pub: issuePubDoi && pub,
	});
	const json = postprocessJson(
		doiBatch({
			body: renderBody({
				globals: {
					...dois,
					timestamp: timestamp,
				},
				community: community,
				collection: collection,
				pub: pub,
			}),
			doiBatchId: doiBatchId,
			timestamp: timestamp,
		}),
	);
	return {
		json: json,
		dois: dois,
		timestamp: timestamp,
	};
};
