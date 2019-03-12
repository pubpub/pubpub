const schemas = [
	{
		kind: 'book',
		label: { singular: 'book', plural: 'books' },
		bpDisplayIcon: 'book',
		contextHints: [
			{ value: 'foreword', label: 'Foreword' },
			{ value: 'supplementary-material', label: 'Supplementary Material' },
			{ value: 'chapter', label: 'Chapter', default: true },
		],
		metadata: [
			{ field: 'title', label: 'Title', derivedFrom: ({ collection }) => collection.title },
			{ field: 'doi', label: 'DOI', hintDerivedFrom: ({ collection }) => collection.doi },
			{ field: 'isbn', label: 'ISBN' },
			{ field: 'editions', label: 'Editions', kind: 'number' },
			{ field: 'author', label: 'Author' },
			{ field: 'editor', label: 'Editor' },
		],
	},
	{
		kind: 'tag',
		label: { singular: 'tag', plural: 'tags' },
		bpDisplayIcon: 'tag',
		metadata: [],
	},
];

export default schemas;

export const getSchemaForKind = (kind) => {
	const result = schemas.find((s) => s.kind === kind);
	if (result) {
		return result;
	}
	throw new Error(`No collection schema of kind ${kind} has been defined`);
};
