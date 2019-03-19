import { getSchemaForKind } from 'shared/collections/schemas';
import findRank from 'shared/util/findRank';

export const createPubSelection = (pub, collection, rank, contextHintValue = null, id = null) => {
	const { contextHints } = getSchemaForKind(collection.kind);
	const contextHint = contextHintValue
		? contextHints.find((ch) => ch.value === contextHintValue)
		: contextHints.find((ch) => ch.default);
	return {
		pub: pub,
		collection: collection,
		rank: rank,
		contextHint: contextHint,
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
		.concat(pub.collectionPubs.map((pt) => pt.collection.title))
		.filter((x) => x)
		.map(normalize);
	return normalizedSources.some((source) => source.includes(normalizedInput));
};

export const findRankForSelection = (selections, index) =>
	findRank(selections.map((s) => s.rank), index);
