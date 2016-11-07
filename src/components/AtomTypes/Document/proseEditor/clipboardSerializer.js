import {DOMSerializer, DOMParser} from 'prosemirror-model';

import ElementSchema from './elementSchema';
import {schema} from './schema';

const markSerializer = DOMSerializer.marksFromSchema(schema);
const nodeSerializer = DOMSerializer.nodesFromSchema(schema);

nodeSerializer.block_embed = function toDOM(node) {
  return ElementSchema.serializeNode(node);
};

nodeSerializer.embed = function toDOM(node) {
  return ElementSchema.serializeNode(node);
};

const clipboardSerializer = new DOMSerializer(nodeSerializer, markSerializer);

const defaultRules = DOMParser.schemaRules(schema);

const getNodeAttrs = (dom) => {
  const nodeId = dom.getAttribute('data-nodeId');
  const nodeAttrs = ElementSchema.findNodeById(nodeId).attrs;
  const randomId = Math.floor(Math.random()*10000000);
  return {
    source: nodeAttrs.source,
    data: nodeAttrs.data,
    align: nodeAttrs.align,
    size: nodeAttrs.size,
    caption: nodeAttrs.caption,
    mode: nodeAttrs.mode,
    className: nodeAttrs.className,
    figureName: nodeAttrs.figureName,
    nodeId: nodeAttrs.randomId,
    children: null,
    childNodes: null,
  };
};

for (const rule of defaultRules) {

  if (rule.node === 'block_embed') {
    rule.tag = 'div.block-embed';
    rule.getAttrs = getNodeAttrs;
  } else if (rule.node === 'embed') {
    rule.tag = 'span.embed';
    rule.getAttrs = getNodeAttrs;
  }

}
const clipboardParser = new DOMParser(schema, defaultRules);


exports.clipboardSerializer = clipboardSerializer;
exports.clipboardParser = clipboardParser;
