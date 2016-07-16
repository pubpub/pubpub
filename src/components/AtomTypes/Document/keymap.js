const Keymap = require('browserkeymap');
const browser = require('prosemirror/dist/util/browser');
const {wrapIn, setBlockType, wrapInList, splitListItem, liftListItem, sinkListItem, chainCommands, newlineInCode, toggleMark} = require('prosemirror/dist/edit').commands;

// You can suppress or map these bindings by passing a `mapKeys`
// argument, which maps key names (say `"Mod-B"` to either `false`, to
// remove the binding, or a new key name string.
function buildKeymap(schema, mapKeys) {

	const keys = {};
	function bind(key, cmd) {
		let newKey = key;
		if (mapKeys) {
			const mapped = mapKeys[newKey];
			if (mapped === false) return;
			if (mapped) newKey = mapped;
		}
		keys[newKey] = cmd;
	}

	bind('Mod-B', toggleMark(schema.marks.strong)); // Mark: Toggle Bold
	bind('Mod-I', toggleMark(schema.marks.em)); // Mar: Toggle Italic
	bind('Mod-`', toggleMark(schema.marks.code)); // Mark: Toggle Code

	bind('Shift-Ctrl-8', wrapInList(schema.nodes.bullet_list)); // Node: Bullet List
	bind('Shift-Ctrl-9', wrapInList(schema.nodes.ordered_list)); // Node: Ordered List
	bind('Shift-Ctrl-.', wrapIn(schema.nodes.blockquote)); // Node: Blockquote
	bind('Enter', splitListItem(schema.nodes.list_item)); // Node: List item split
	bind('Mod-[', liftListItem(schema.nodes.list_item)); // Node: List item lift
	bind('Mod-]', sinkListItem(schema.nodes.list_item)); // Node: List item sink
	bind('Shift-Ctrl-0', setBlockType(schema.nodes.paragraph)); // Node: Paragraph
	bind('Shift-Ctrl-\\', setBlockType(schema.nodes.code_block)); // Node: Code block
	bind('Mod-Shift--', pm => pm.tr.replaceSelection(schema.nodes.horizontal_rule.create()).applyAndScroll()); // Node: Horizontal Rule
	
	// Node: Headings 1-6
	for (let index = 1; index <= 6; index++) { 
		bind('Shift-Ctrl-' + index, setBlockType(schema.nodes.heading, {level: index}));
	} 
	
	// Node: Hard break
	const cmd = chainCommands(newlineInCode, pm => pm.tr.replaceSelection(schema.nodes.hard_break.create()).applyAndScroll());
	bind('Mod-Enter', cmd);
	bind('Shift-Enter', cmd);
	if (browser.mac) bind('Ctrl-Enter', cmd);

	return new Keymap(keys);
}
exports.buildKeymap = buildKeymap;
