import { toTitleCase } from 'utils/strings';

export const relationTypeDefinitions = {
	comment: {
		name: 'Comment',
		article: 'a',
		preposition: 'on',
		isIntraWork: false,
		crossrefRelationshipTypes: ['isCommentOn', 'hasComment'],
	},
	commentary: {
		name: 'Commentary',
		article: 'a',
		preposition: 'on',
		isIntraWork: false,
		crossrefRelationshipTypes: ['isCommentOn', 'hasComment'],
	},
	preprint: {
		name: 'Preprint',
		article: 'a',
		preposition: 'of',
		isIntraWork: true,
		crossrefRelationshipTypes: ['isPreprintOf', 'hasPreprint'],
	},
	rejoinder: {
		name: 'Rejoinder',
		article: 'a',
		preposition: 'to',
		isIntraWork: false,
		crossrefRelationshipTypes: ['isReplyTo', 'hasReply'],
	},
	reply: {
		name: 'Reply',
		article: 'a',
		preposition: 'to',
		isIntraWork: false,
		crossrefRelationshipTypes: ['isReplyTo', 'hasReply'],
	},
	review: {
		name: 'Review',
		article: 'a',
		preposition: 'of',
		isIntraWork: false,
		crossrefRelationshipTypes: ['isReviewOf', 'hasReview'],
	},
	supplement: {
		name: 'Supplement',
		article: 'a',
		preposition: 'of',
		isIntraWork: false,
		crossrefRelationshipTypes: ['isSupplementTo', 'isSupplementedBy'],
	},
	translation: {
		name: 'Translation',
		article: 'a',
		preposition: 'of',
		isIntraWork: true,
		crossrefRelationshipTypes: ['isTranslationOf', 'hasTranslation'],
	},
	version: {
		name: 'Version',
		article: 'a',
		preposition: 'of',
		isIntraWork: true,
		crossrefRelationshipTypes: ['isVersionOf', 'hasVersion'],
	},
};

const createRelationTypeEnum = () => {
	const res = {};
	Object.entries(relationTypeDefinitions).forEach(([key]) => {
		res[toTitleCase(key)] = key;
	});
	return res;
};

export const relationTypes = Object.keys(relationTypeDefinitions);
export const RelationType = createRelationTypeEnum();

export const findParentPubFromEdges = (edges, relationTypes, inbound) => {
	for (let i = 0; i < edges.length; i++) {
		const { pubIsParent, pub, targetPub, relationType } = edges[i];

		if (inbound ? pubIsParent : !pubIsParent) {
			for (let j = 0; j < relationTypes.length; j++) {
				if (relationType === relationTypes[j]) {
					return inbound ? pub : targetPub;
				}
			}
		}
	}

	return null;
};

export const findParentPubByRelationTypes = (pub, ...relationTypes) => {
	const { inboundEdges, outboundEdges } = pub;

	return (
		findParentPubFromEdges(inboundEdges, relationTypes, true) ||
		findParentPubFromEdges(outboundEdges, relationTypes)
	);
};
