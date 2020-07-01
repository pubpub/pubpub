export const Filter = {
	Parent: 'parent',
	Sibling: 'sibling',
	Child: 'child',
};

export const Mode = {
	Carousel: 'carousel',
	List: 'list',
};

export const RelationshipType = {
	Discussion: 'discussion',
	Review: 'review',
};

export const pluralFilterLookup = {
	[Filter.Parent]: 'parents',
	[Filter.Sibling]: 'siblings',
	[Filter.Child]: 'children',
};
