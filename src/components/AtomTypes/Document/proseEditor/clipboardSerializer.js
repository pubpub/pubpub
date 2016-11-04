import {DOMSerializer} from 'prosemirror-model';

import ElementSchema from './elementSchema';
import {schema} from './schema';

const markSerializer = DOMSerializer.marksFromSchema(schema);
const defaultNodeSerializer = DOMSerializer.nodesFromSchema(schema);
const nodeSerializer = (node) => {
	if (node.type !== 'block_embed') {
		return defaultNodeSerializer(node);
	} else {
    return ElementSchema.createElementAtNode(node, true);
  }

};

const clipboardSerializer = new DOMSerializer(nodeSerializer, markSerializer);
