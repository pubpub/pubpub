import { buildSchema, jsonToNode, getNotes } from '@pubpub/editor';

import { getBranchDoc } from '../../../server/utils/firebaseAdmin';
import { generateCiteHtmls } from '../../../server/editor/queries';

export const getProsemirrorPubData = async (pubId, branchId) => {
	const { content: prosemirrorDoc } = await getBranchDoc(pubId, branchId);
	const schema = buildSchema();
	const doc = jsonToNode(prosemirrorDoc, schema);
	const { footnotes: rawFootnotes, citations: rawCitations } = getNotes(doc);
	const footnotes = await generateCiteHtmls(rawFootnotes);
	const citations = await generateCiteHtmls(rawCitations);
	return { prosemirrorDoc: prosemirrorDoc, footnotes: footnotes, citations: citations };
};
