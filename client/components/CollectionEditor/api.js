import { apiFetch } from 'utilities';

import { createPubSelection } from './util';

const API_ROOT = '/api/collectionPubs';

// The backend model used to represent these collection editor selections is CollectionPub. We
// abstract away that terminology on the frontend, but it's used here to indicate a function that
// takes raw CollectionPub data from the server and creates a pub selection object that the
// CollectionEditor component understands how to manipulate.
const createPubSelectionFromCollectionPub = (collectionPub, allPubs, collection) => {
	const { contextHint, rank, id } = collectionPub;
	const pub = allPubs.find((p) => p.id === collectionPub.pubId);
	return createPubSelection(pub, collection, rank, contextHint, id);
};

export default (collection, communityId) => ({
	loadPubSelections: (allPubs) =>
		apiFetch(`${API_ROOT}/bulk?collectionId=${collection.id}&communityId=${communityId}`, {
			method: 'GET',
		}).then((collectionPubs) =>
			collectionPubs.map((cp) =>
				createPubSelectionFromCollectionPub(cp, allPubs, collection),
			),
		),
	addPubSelection: (pubId, rank) =>
		apiFetch(API_ROOT, {
			method: 'POST',
			body: JSON.stringify({
				pubId: pubId,
				collectionId: collection.id,
				communityId: communityId,
				rank: rank,
			}),
		}),
	updatePubSelection: (id, update) =>
		apiFetch(API_ROOT, {
			method: 'PUT',
			body: JSON.stringify({
				...update,
				id: id,
				collectionId: collection.id,
				communityId: communityId,
			}),
		}),
	deletePubSelection: (id) =>
		apiFetch(API_ROOT, {
			method: 'DELETE',
			body: JSON.stringify({
				id: id,
				collectionId: collection.id,
				communityId: communityId,
			}),
		}),
});
