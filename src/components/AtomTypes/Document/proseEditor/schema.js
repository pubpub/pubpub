import {Schema, Fragment, Mark, NodeType, MarkType, DOMParser, DOMSerializer} from 'prosemirror-model';
import {addListNodes} from 'prosemirror-schema-list';
import {addTableNodes} from 'prosemirror-schema-table';

import ElementSchema from './elementSchema';
import {schema as basicSchema} from './schema-basic';

// ;; An inline embed node type. Has these attributes:
//
// - **`src`** (required): The slug of the pub.
// - **`className`**: An optional className for styling.
// - **`id`**: An option id for styling to linking.
// - **`align`**: inline, left, right, or full
// - **`size`**: CSS valid width
// - **`caption`**: String caption to place under the embed
// - **`data`**: Cached version/atom data. This is not serialized into markdown (in the long-term), but is kept here for fast rendering

const SubMark = {
    parseDOM: [{tag: "sub"}],
    toDOM() { return ["sub"] }
};

const SupMark = {
    parseDOM: [{tag: "sup"}],
    toDOM() { return ["sup"] }
};

const StrikeThroughMark = {
    parseDOM: [{tag: "s"}],
    toDOM() { return ["s"] }
};

const PageBreak = {
    group: "block",
    toDOM(node) { return ['div', {class: 'pagebreak'}, 'pagebreak']; }
};

const Emoji = {
  group: 'inline',
  attrs: {
    content: {default: ''},
    markup: {default: ''},
  },
	toDOM: function(node) {
		return ['span', node.attrs.content];
	},
  inline: true,
}

const Embed = {
	attrs: {
		source: {default: ''},
		className: {default: ''},
		id: {default: ''},
		nodeId: {default: null},
		align: {default: 'full'},
		size: {default: ''},
		caption: {default: ''},
		mode: {default: 'embed'},
		data: {default: {}},
		selected: {default: false},
		figureName: {default: ''},
	},
	toDOM: function(node) {
		return ElementSchema.createElementAtNode(node);
	},
	parseDOM: [{
		tag: 'span.embed',
		getAttrs: dom => {
			const nodeId = dom.getAttribute('data-nodeId');
      console.log('Creating Embed');
			const nodeAttrs = ElementSchema.findNodeById(nodeId).attrs;
			return {
				source: nodeAttrs.source,
				data: nodeAttrs.data,
				align: nodeAttrs.align,
				size: nodeAttrs.size,
				caption: nodeAttrs.caption,
				mode: nodeAttrs.mode,
				className: nodeAttrs.className,
				figureName: nodeAttrs.figureName,
				nodeId: nodeAttrs.nodeId,
				children: null,
				childNodes: null,
			};
		}
	}],
	inline: true,
	group: 'inline',
	draggable: false,
};

const BlockEmbed = {
	attrs: {
		source: {default: ''},
		className: {default: ''},
		id: {default: ''},
		nodeId: {default: null},
		align: {default: 'full'},
		size: {default: ''},
		caption: {default: ''},
		mode: {default: 'embed'},
		data: {default: {}},
		selected: {default: false},
		figureName: {default: ''},
	},
	toDOM: function(node) {
		return ElementSchema.createElementAtNode(node, true);
	},
	parseDOM: [{
		tag: 'div.block-embed',
		getAttrs: dom => {
			const nodeId = dom.getAttribute('data-nodeId');
      console.log('Creating block Embed');
			const nodeAttrs = ElementSchema.findNodeById(nodeId).attrs;
			return {
				source: nodeAttrs.source,
				data: nodeAttrs.data,
				align: nodeAttrs.align,
				size: nodeAttrs.size,
				caption: nodeAttrs.caption,
				mode: nodeAttrs.mode,
				className: nodeAttrs.className,
				figureName: nodeAttrs.figureName,
				nodeId: nodeAttrs.nodeId,
				children: null,
				childNodes: null,
			};
		}
	}],
	inline: false,
	group: 'block',
	draggable: false,
	isTextblock: true,
	locked: true,
};

const schemaNodes = basicSchema.nodeSpec.addBefore('image', 'embed', Embed).addBefore('image', 'block_embed', BlockEmbed).addBefore('horizontal_rule', 'page_break', PageBreak).addBefore('image', 'emoji', Emoji);
const listSchema = addListNodes(schemaNodes, "paragraph block*", "block");
const tableSchema = addTableNodes(listSchema, "paragraph block*", "block");

export const schema = new Schema({
	nodes: tableSchema,
	marks: basicSchema.markSpec.addBefore('code', 'sub', SubMark).addBefore('code', 'sup', SupMark).addBefore('code', 'strike', StrikeThroughMark)
});

const EmbedType = schema.nodes.embed;

exports.Embed = EmbedType;


const migrateMarks = (node) => {
	if (node.content) {
		for (const subNode of node.content) {
			migrateMarks(subNode);
		}
	}
	if (node.marks) {
		node.marks = node.marks.map((mark) => {
			if (!mark._) {
				return mark;
			}
			return {
				type: mark._,
				/*
				attrs: {


				}
				*/
			}
		});
	}
	if (node.slice) {
		migrateMarks(node.slice);
	}
};

exports.migrateMarks = migrateMarks;


const migrateDiffs = (diffs) => {
	for (const diff of diffs) {
		migrateMarks(diff);
	}
};

exports.migrateDiffs = migrateDiffs;
