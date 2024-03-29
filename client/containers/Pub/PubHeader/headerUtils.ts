import { DocJson, Pub } from 'types';
import { EditorChangeObject, getJSON } from 'client/components/Editor';

// The "formatted download" is the file that the pub manager can upload themselves to represent the
// pub. It's stored in pub.downloads, but it's treated as a kind of special case.
export const getFormattedDownload = (downloads: Pub['downloads']) => {
	if (!downloads) {
		return null;
	}
	return downloads.reduce((prev, curr) => {
		const currIsNewer = !prev || !prev.createdAt || curr.createdAt > prev.createdAt;
		if (curr.type === 'formatted' && currIsNewer) {
			return curr;
		}
		return prev;
	}, null);
};

export type PubHeading = {
	title: string;
	level: number;
	href: string | null;
	index: number;
};

const getTocHeadings = (docJson: DocJson): PubHeading[] => {
	return docJson.content
		.filter((item) => {
			return item.type === 'heading' && item.attrs.level < 3;
		})
		.map((item, index) => {
			const textContent =
				item.content &&
				item.content
					.filter((node) => {
						/* Filter to remove inline non-text nodes: e.g. equations */
						return node.type === 'text';
					})
					.reduce((prev, curr) => {
						return `${prev}${curr.text}`;
					}, '');
			return {
				title: textContent,
				level: item.attrs.level,
				href: item.attrs.fixedId || item.attrs.id,
				index,
			};
		})
		.filter((item) => {
			/* Filter out empty headers */
			return item.title;
		});
};

export const getPubHeadings = (
	initialDoc: DocJson,
	editorChangeObject: null | EditorChangeObject,
) => {
	let docJson = initialDoc;
	if (editorChangeObject && editorChangeObject.view) {
		docJson = getJSON(editorChangeObject.view)!;
	}
	return docJson ? getTocHeadings(docJson) : [];
};
