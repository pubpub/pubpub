const urlForCommunity = () => '';

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
			{
				name: 'title',
				label: 'Title',
				hintDerivedFrom: ({ collection }) => collection.title,
			},
			{
				name: 'doi',
				label: 'DOI',
				hintDerivedFrom: ({ collection }) => collection.doi,
				disabled: true,
			},
			{
				name: 'url',
				label: 'URL',
				hintDerivedFrom: ({ community }) => urlForCommunity(community),
			},
			{ name: 'isbn', label: 'ISBN' },
			{ name: 'copyright-year', label: 'Copyright year', permitted: '^[0-9]*$' },
			{ name: 'edition', label: 'Edition', permitted: '^[0-9]*$' },
			{
				name: 'contributors',
				label: 'Contributors',
				isMulti: true,
				hintDerivedFrom: () => ['Test 1', 'Test 2', 'Test 3'],
			},
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
