import { importDocJson, getNotes } from '@pubpub/editor';

export const importDocToEditor = (prosemirrorView, docJson, updateLocalData) => {
	const doc = importDocJson(prosemirrorView, docJson);
	const { footnotes, citations } = getNotes(doc);
	console.log('got these notes', footnotes, citations);
	setTimeout(() => updateLocalData('pub', { footnotes: footnotes, citations: citations }));
};
