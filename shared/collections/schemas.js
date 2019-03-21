import { communityUrl } from 'shared/util/canonicalUrls';

const schemas = [
	{
		kind: 'book',
		label: { singular: 'book', plural: 'books' },
		bpDisplayIcon: 'book',
		contextHints: [
			{ value: 'foreword', label: 'Foreword' },
			{ value: 'supplementaryMaterial', label: 'Supplementary Material' },
			{ value: 'chapter', label: 'Chapter', default: true },
		],
		metadata: [
			{
				name: 'doi',
				label: 'DOI',
				defaultDerivedFrom: ({ collection }) => collection.doi,
				disabled: true,
			},
			{
				name: 'url',
				label: 'URL',
				defaultDerivedFrom: ({ community }) => communityUrl(community),
			},
			{ name: 'isbn', label: 'ISBN' },
			{ name: 'copyrightYear', label: 'Copyright year', pattern: '^[0-9]*$' },
			{ name: 'edition', label: 'Edition no.', pattern: '^[0-9]*$' },
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
