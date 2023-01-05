import { Schema } from 'prosemirror-model';

import { defaultNodes, defaultMarks } from 'components/Editor/schemas';
import {
	marks as suggestedEditMarks,
	amendNodeSpecWithSuggestedEdits,
} from 'components/Editor/plugins/suggestedEdits/schema';

export const buildSchema = (customNodes = {}, customMarks = {}) => {
	const schemaNodes = {
		...defaultNodes,
		...customNodes,
	};
	const schemaMarks = {
		...defaultMarks,
		...customMarks,
		...suggestedEditMarks,
	};

	Object.keys(schemaNodes).forEach((nodeKey) => {
		const nodeSpec = schemaNodes[nodeKey];
		if (nodeSpec) {
			schemaNodes[nodeKey] = amendNodeSpecWithSuggestedEdits(nodeSpec);
		}
	});

	/* Filter out undefined (e.g. overwritten) nodes and marks */
	Object.keys(schemaNodes).forEach((nodeKey) => {
		if (!schemaNodes[nodeKey]) {
			delete schemaNodes[nodeKey];
		}
	});
	Object.keys(schemaMarks).forEach((markKey) => {
		if (!schemaMarks[markKey]) {
			delete schemaMarks[markKey];
		}
	});

	return new Schema({
		nodes: schemaNodes,
		marks: schemaMarks,
		topNode: 'doc',
	});
};

export const editorSchema = buildSchema();
