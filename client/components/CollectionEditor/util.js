import { getSchemaForKind } from 'shared/collections/schemas';

export const createPubSelection = (pub, collection, contextHint = null, id = null) => {
	const resultingContextHint =
		contextHint || getSchemaForKind(collection.kind).contextHints.find((ch) => ch.default);
	return {
		pub: pub,
		collection: collection,
		contextHint: resultingContextHint,
		id: id,
	};
};

export const authorsNamesFromPub = (pub) =>
	pub.attributions.map((attr) => attr.name).filter((x) => x);

export const fuzzyMatchPub = (pub, input) => {
	if (input.length === 0) {
		return true;
	}
	const normalize = (s) => s.toLowerCase();
	const normalizedInput = normalize(input);
	const normalizedSources = [pub.title]
		.concat(authorsNamesFromPub(pub))
		.concat(pub.pubTags.map((pt) => pt.tag.title))
		.filter((x) => x)
		.map(normalize);
	return normalizedSources.some((source) => source.includes(normalizedInput));
};
