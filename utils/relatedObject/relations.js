export const relationTypeDefinitions = {
	comment: {
		label: 'comment',
		relationString: 'is a comment on',
		passiveRelationString: 'is commented on by',
	},
	preprint: {
		label: 'preprint',
		relationString: 'is a preprint of',
		passiveRelationString: 'has preprint',
	},
	reply: {
		label: 'reply',
		relationString: 'is a reply to',
		passiveRelationString: 'is replied to by',
	},
	review: {
		label: 'review',
		relationString: 'is a review of',
		passiveRelationString: 'is reviewed by',
	},
	supplement: {
		label: 'supplement',
		relationString: 'is a supplement to',
		passiveRelationString: 'is supplemented by',
	},
	translation: {
		label: 'translation',
		relationString: 'is a translation of',
		passiveRelationString: 'is translated to another language in',
	},
	version: {
		label: 'version',
		relationString: 'is a version of',
		passiveRelationString: 'has another version in',
	},
};

export const relationTypes = Object.keys(relationTypeDefinitions);
