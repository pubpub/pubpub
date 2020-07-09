import { toTitleCase } from 'utils/strings';

export const relationTypeDefinitions = {
	comment: {
		label: 'Comment',
		childRelationString: 'is a comment on',
		parentRelationString: 'is commented on by',
	},
	preprint: {
		label: 'Preprint',
		childRelationString: 'is a preprint of',
		parentRelationString: 'has preprint',
	},
	reply: {
		label: 'Reply',
		childRelationString: 'is a reply to',
		parentRelationString: 'is replied to by',
	},
	review: {
		label: 'Review',
		childRelationString: 'is a review of',
		parentRelationString: 'is reviewed by',
	},
	supplement: {
		label: 'Supplement',
		childRelationString: 'is a supplement to',
		parentRelationString: 'is supplemented by',
	},
	translation: {
		label: 'Translation',
		childRelationString: 'is a translation of',
		parentRelationString: 'is translated to another language in',
	},
	version: {
		label: 'Version',
		childRelationString: 'is a version of',
		parentRelationString: 'has another version in',
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
