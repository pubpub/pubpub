/* To convert to and from how the document is stored in the database to how ProseMirror expects it.
We use the DOM import for ProseMirror as the JSON we store in the database is really jsonized HTML.
*/

import {Node} from 'prosemirror-model';

export const modelToEditor = function(doc, schema) {
	return Node.fromJSON(schema, doc.contents);
};


export const editorToModel = function(pmDoc) {
	// In order to stick with the format used in Fidus Writer 1.1-2.0,
	// we do a few smaller modifications to the node before it is saved.
	return pmDoc.toJSON();
};
