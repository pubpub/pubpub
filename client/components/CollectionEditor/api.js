import { apiFetch } from 'utilities';

import { getSchemaForKind } from 'shared/collections/schemas';

import { createPubSelection } from './util';

// The backend model used to represent these collection editor selections is CollectionPub. We
// abstract away that terminology on the frontend, but it's used here to indicate a function that
// takes raw CollectionPub data from the server and creates a pub selection object that the
// CollectionEditor component understands how to manipulate.
const createPubSelectionFromCollectionPub = (collectionPub, allPubs, collection) => {
	const pub = allPubs.find((p) => p.id === collectionPub.pubId);
	const schema = getSchemaForKind(collection.kind);
	const contextHint = schema.contextHints.find((ch) => ch.value === collectionPub.contextHint);
	return createPubSelection(pub, collection, contextHint, collectionPub.id);
};

export const loadPubSelections = (allPubs, collection, communityId) =>
	apiFetch(`/api/collectionPubs/bulk?collectionId=${collection.id}&communityId=${communityId}`, {
		method: 'GET',
	}).then((collectionPubs) =>
		collectionPubs.map((cp) => createPubSelectionFromCollectionPub(cp, allPubs, collection)),
	);

export const persistPubSelections = (selections, allPubs, collection, communityId) =>
	apiFetch('/api/collectionPubs/bulk', {
		method: 'POST',
		body: JSON.stringify({
			communityId: communityId,
			collectionId: collection.id,
			collectionPubs: selections.map(({ pub, contextHint, id }) => ({
				id: id,
				contextHint: contextHint.value,
				pubId: pub.id,
				collectionId: collection.id,
			})),
		}),
	}).then((collectionPubs) =>
		collectionPubs.map((cp) => createPubSelectionFromCollectionPub(cp, allPubs, collection)),
	);
