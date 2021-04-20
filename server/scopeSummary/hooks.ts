import { Discussion, ReviewNew, Pub, CollectionPub } from 'server/models';
import { summarizeCollection, summarizePub } from './queries';

[Discussion, ReviewNew].forEach((Model) => {
	Model.afterCreate(async ({ pubId }) => {
		await summarizePub(pubId);
	});
});

Pub.afterCreate(async ({ id }) => {
	await summarizePub(id);
});

CollectionPub.afterCreate(async ({ collectionId }) => {
	await summarizeCollection(collectionId);
});
