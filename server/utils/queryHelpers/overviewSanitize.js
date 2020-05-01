import sanitizePub from './pubSanitize';
import sanitizeCollection from './collectionSanitize';

export default async (initialData, overviewData) => {
	let sanitizedPubs = await Promise.all(
		overviewData.pubs.map((pub) => {
			return sanitizePub(pub, initialData);
		}),
	);
	sanitizedPubs = sanitizedPubs.filter((pub) => {
		return !!pub;
	});

	const sanitizedCollections = overviewData.collections
		.map((collection) => {
			return sanitizeCollection(collection, initialData);
		})
		.filter((collection) => {
			return !!collection;
		});

	return {
		...overviewData,
		pubs: sanitizedPubs,
		collections: sanitizedCollections,
	};
};
