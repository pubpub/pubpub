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
		communityDoi: createDoi({ community: community }),
		collectionDoi: collection && createDoi({ community: community, target: collection }),
		pubDoi: pub && createDoi({ community: community, target: pub }),
		getPubVersionDoi:
			pub &&
			((version) =>
				createDoi({
					community: community,
					target: pub,
					version: version,
				})),
	};
};

const removeEmptyKeys = (obj) => {
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object') removeEmptyKeys(obj[key]);
		// eslint-disable-next-line no-param-reassign
		else if (obj[key] === undefined) delete obj[key];
	});
	return obj;
};

export default ({ community, collection, pub }) => {
	const timestamp = new Date().getTime();
	const doiBatchId = `${timestamp}_${community.id.slice(0, 8)}`;
	const dois = getDois({
		community: community,
		collection: collection,
		pub: pub,
	});
	const json = removeEmptyKeys(
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
