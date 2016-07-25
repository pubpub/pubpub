const {blockQuoteRule, orderedListRule, bulletListRule, codeBlockRule, headingRule, inputRules, allInputRules} = require('prosemirror/dist/inputrules');
const {Plugin} = require('prosemirror/dist/edit');
const {menuBar, tooltipMenu} = require('prosemirror/dist/menu');
const {InputRule} = require('prosemirror/dist/inputrules');

const {buildMenuItems} = require('./menu');
const {buildKeymap} = require('./keymap');


// This module exports helper functions for deriving a set of pubpub-specific
// menu items, input rules, or key bindings from a schema. These
// values need to know about the schema for two reasons—they need
// access to specific instances of node and mark types, and they need
// to know which of the node and mark types that they know about are
// actually present in the schema.
//
// The `pubpubSetup` plugin ties these together into a plugin that
// will automatically enable this basic functionality in an editor.

// :: (Schema) → [InputRule]
// A set of input rules for creating the basic block quotes, lists,
// code blocks, and heading.
function buildInputRules(schema) {
	const result = [];
	
	result.push(blockQuoteRule(schema.nodes.blockquote));
	result.push(orderedListRule(schema.nodes.ordered_list));
	result.push(bulletListRule(schema.nodes.bullet_list));
	result.push(codeBlockRule(schema.nodes.code_block));
	result.push(headingRule(schema.nodes.heading, 6));

	const embedRule = new InputRule(/\[\[$/, '[', function(pm, match, pos) {
		const start = pos - match[0].length;
		pm.tr.delete(start, pos).apply();

		function done(attrs) {
			const newNode = pm.schema.nodes.embed.create(attrs);
			pm.tr.insert(start, newNode).apply();
		}
		window.toggleMedia(pm, done, schema.nodes.embed);
	});

	result.push(embedRule);
	
	// Block Cntrl-S from launching the Browser Save window
	document.getElementsByClassName('ProseMirror')[0].addEventListener('keydown', function(evt) {
		if (evt.keyCode === 83 && (navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey)) {
			evt.preventDefault();
			evt.stopPropagation();
		}
	}, false);

	return result;
}

exports.pubpubSetup = new Plugin(class {
	constructor(pm, options) {

		
		this.keymap = buildKeymap(pm.schema, options.mapKeys);
		pm.addKeymap(this.keymap);
		this.inputRules = allInputRules.concat(buildInputRules(pm.schema));
		const rules = inputRules.ensure(pm);
		this.inputRules.forEach(rule => rules.addRule(rule));

		let builtMenu;
		this.barConf = options.menuBar;
		this.tooltipConf = options.tooltipMenu;

		let className;

		if (this.barConf === true) {
			builtMenu = buildMenuItems(pm.schema);
			this.barConf = {float: true, content: builtMenu.fullMenu};
			className = require('./style').className;
		}
		if (this.barConf) menuBar.config(this.barConf).attach(pm);

		if (this.tooltipConf === true) {
			if (!builtMenu) builtMenu = buildMenuItems(pm.schema);
			this.tooltipConf = {
				selectedBlockMenu: true,
				inlineContent: builtMenu.minimalMenu,
				// blockContent: builtMenu.blockMenu
				blockContent: []
			};
		}
		if (this.tooltipConf) tooltipMenu.config(this.tooltipConf).attach(pm);
		pm.wrapper.classList.add(className);
	}
	detach(pm) {
		pm.wrapper.classList.remove(className);
		pm.removeKeymap(this.keymap);
		const rules = inputRules.ensure(pm);
		this.inputRules.forEach(rule => rules.removeRule(rule));
		if (this.barConf) menuBar.detach(pm);
		if (this.tooltipConf) tooltipMenu.detach(pm);
	}
}, {
	menuBar: true,
	tooltipMenu: false,
	mapKeys: null
});
