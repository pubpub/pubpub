import {MenuItem, toggleMarkItem, insertItem, wrapItem, wrapListItem, blockTypeItem, Dropdown, joinUpItem, liftItem, icons} from 'prosemirror-menu';
// import {elt} from 'prosemirror/dist/util/dom';

// : (ProseMirror, (attrs: ?Object))
// A function that will prompt for the attributes of a [link
// mark](#LinkMark) (using `FieldPrompt`), and call a callback with
// the result.
/*
function promptLinkAttrs(pm, callback) {
	new FieldPrompt(pm, 'Create a link', {
		href: new TextField({
			label: 'Link target',
			required: true,
			clean: (val) => {
				let newVal = val;
				if (!/^https?:\/\//i.test(newVal)) {
					newVal = 'http://' + newVal;
				}
				return newVal;
			}
		}),
		title: new TextField({label: 'Title'})
	}).open(callback);
}
*/

function buildMenuItems(schema) {
	const items = {};

	items.toggleStrong = toggleMarkItem(schema.marks.strong, {
		title: 'Toggle strong style',
		icon: {text: 'bold'},
	});

	items.toggleEm = toggleMarkItem(schema.marks.em, {
		title: 'Toggle emphasis',
		icon: {text: 'italic'},
	});

	items.toggleSub = toggleMarkItem(schema.marks.sub, {
		title: 'Toggle subscript',
		label: 'subscript',
	});

	items.toggleSup = toggleMarkItem(schema.marks.sup, {
		title: 'Toggle superscript',
		label: 'superscript',
	});

	items.toggleStrikeThrough = toggleMarkItem(schema.marks.strike, {
		title: 'Toggle strikethrough',
		label: 'strikethrough',
	});

	items.toggleCode = toggleMarkItem(schema.marks.code, {
		title: 'Toggle code font',
		label: 'inline code',
	});

/*
	items.toggleLink = toggleMarkItem(schema.marks.link, {
		title: 'Add or remove link',
		icon: {text: 'link'},
		attrs: promptLinkAttrs,
	});
*/

	items.wrapBulletList = wrapListItem(schema.nodes.bullet_list, {
		title: 'Wrap in bullet list',
		icon: icons.bulletList,
	});

	items.wrapOrderedList = wrapListItem(schema.nodes.ordered_list, {
		title: 'Wrap in ordered list',
		icon: icons.orderedList,
	});

	items.wrapBlockQuote = wrapItem(schema.nodes.blockquote, {
		title: 'Wrap in block quote',
		icon: icons.blockquote,
	});

	items.makeParagraph = blockTypeItem(schema.nodes.paragraph, {
		title: 'Change to paragraph',
		icon: {text: 'Plain'},
	});

	items.makeCodeBlock = blockTypeItem(schema.nodes.code_block, {
		title: 'Change to code block',
		icon: {text: 'code block'},
	});

	for (let index = 1; index <= 10; index++) {
		items['makeHead' + index] = blockTypeItem(schema.nodes.heading, {
			title: 'Change to heading ' + index,
			icon: {text: 'H' + index},
			attrs: {level: index},
		});
	}

	items.insertHorizontalRule = insertItem(schema.nodes.horizontal_rule, {
		title: 'Insert horizontal rule',
		label: 'horizontal rule',
	});

	items.insertPageBreak = insertItem(schema.nodes.page_break, {
		title: 'Insert page break',
		label: 'page break',
	});


	items.insertEmbed = insertItem(schema.nodes.block_embed, {
		title: 'Insert Image, Video, Reference, etc',
		icon: {text: 'insert'},
		attrs: (pm, callback) =>{
			const idGenerationCallback = (nodeAttrs) => {
				const randomId = Math.floor(Math.random() * 10000000);
				nodeAttrs.nodeId = randomId;
				callback(nodeAttrs);
			};
			window.toggleMedia(pm, idGenerationCallback, schema.nodes.block_embed)
		},
	});

	/*

	items.insertEmbed = insertItem(schema.nodes.embed, {
		title: 'Insert Image, Video, Reference, etc',
		icon: {text: 'insert'},
		attrs: (pm, callback) =>{
			const idGenerationCallback = (nodeAttrs) => {
				const randomId = Math.floor(Math.random()*10000000);
				nodeAttrs.nodeId = randomId;
				callback(nodeAttrs);
			};
			window.toggleMedia(pm, idGenerationCallback, schema.nodes.embed)
		},
	});

	*/

	const embedSelectTest = function(pm) {
		const {node} = pm.selection;
		return node && node.type.name === 'embed';
	};

	items.setAlignInline = new MenuItem({
		run(pm) {
			const selection = pm.selection;
			pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, align: 'inline'}).apply();
		},
		select: embedSelectTest,
		active(pm) {
			const {node} = pm.selection;
			return node && node.attrs.align === 'inline';
		},
		title: 'Set inline',
		icon: {text: 'inline'},
	});
	items.setAlignFull = new MenuItem({
		run(pm) {
			const selection = pm.selection;
			pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, align: 'full'}).apply();
		},
		select: embedSelectTest,
		active(pm) {
			const {node} = pm.selection;
			return node && node.attrs.align === 'full';
		},
		title: 'Set full',
		icon: {text: 'full'},
	});
	items.setAlignLeft = new MenuItem({
		run(pm) {
			const selection = pm.selection;
			pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, align: 'left'}).apply();
		},
		select: embedSelectTest,
		active(pm) {
			const {node} = pm.selection;
			return node && node.attrs.align === 'left';
		},
		title: 'Set left',
		icon: {text: 'left'},
	});
	items.setAlignRight = new MenuItem({
		run(pm) {
			const selection = pm.selection;
			pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, align: 'right'}).apply();
		},
		select: embedSelectTest,
		active(pm) {
			const {node} = pm.selection;
			return node && node.attrs.align === 'right';
		},
		title: 'Set right',
		icon: {text: 'right'},
	});

	// items.setAlignLeft = new MenuItem({
	// 	run(pm) {
	// 		const selection = pm.selection;
	// 		pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, align: 'full'}).apply();
	// 	},
	// 	select: embedSelectTest,
	// 	active(pm) {
	// 		const {node} = pm.selection;
	// 		console.log(node);
	// 		return node && node.attrs.align === 'full';
	// 	},
	// 	title: 'Set full',
	// 	icon: {text: 'full'},
	// 	render(pm) {
	// 		return elt('h3', null, 'Son of a ' + pm.selection.node.attrs.size);
	// 	},
	// });


	// items.setAlignLeft = new MenuItem({
	// 	run(pm) {
	// 		const selection = pm.selection;
	// 		pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, align: 'left'}).apply();
	// 	},
	// 	select: embedSelectTest,
	// 	active(pm) {
	// 		const {node} = pm.selection;
	// 		console.log(node);
	// 		return node && node.attrs.align === 'full';
	// 	},
	// 	title: 'Set full',
	// 	icon: {text: 'full'},
	// });


	class MenuSize {
		// :: (MenuItemSpec)
		constructor(spec) {
			// :: MenuItemSpec
			// The spec used to create the menu item.
			this.spec = spec;
		}

		// :: (ProseMirror) → DOMNode
		// Renders the icon according to its [display
		// spec](#MenuItemSpec.display), and adds an event handler which
		// executes the command when the representation is clicked.
		render(pm) {
			const updateAttr = function(value) {
				const attrsKey = this.spec.attrsKey;
				const selection = pm.selection;
				pm.tr.setNodeType(selection.$from.pos, selection.node.type, {...selection.node.attrs, [attrsKey]: value}).apply();
			};

			// const label = elt('div', null, this.spec.cat);
			const input = document.createElement('input');
			input.type = 'text';
			input.placeholder = 'Type here';
			input.addEventListener('input', function(event) {
				updateAttr(event.target.value);
			}, false);
			const dom = document.createElement('div');
			dom.appendChild(input);
			input.addEventListener('mousedown', event => {
				event.preventDefault();
				event.stopPropagation();
				input.focus();
			});
			return input;
			// return elt('h3', null, label, label);
			// return <h3><em>Son</em> of a {this.spec.cat}</h3>;
		}
	}

	items.setSize = new MenuSize({
		attrsKey: 'size',
	});

	items.insertMenu = new Dropdown([items.toggleSub, items.toggleSup, items.toggleStrikeThrough, items.toggleCode, items.insertHorizontalRule, items.insertPageBreak], {label: '...'});
	items.typeMenu = new Dropdown([items.makeCodeBlock, items.makeHead3, items.makeHead4, items.makeHead5, items.makeHead6], {label: '...'});

	items.inlineMenu = [[items.toggleStrong, items.toggleEm, items.toggleLink, items.insertMenu], [items.insertEmbed]];
	items.blockMenu = [[items.makeParagraph, items.makeHead1, items.makeHead2, items.wrapBulletList, items.wrapOrderedList, items.wrapBlockQuote, joinUpItem, liftItem, items.typeMenu]];
	items.fullMenu = items.inlineMenu.concat(items.blockMenu);

	items.blockDropdownMenu = [items.makeParagraph, items.makeHead1, items.makeHead2, new Dropdown([items.wrapBulletList, items.wrapOrderedList, items.wrapBlockQuote, joinUpItem, liftItem, items.makeCodeBlock, items.makeHead3, items.makeHead4, items.makeHead5, items.makeHead6], {label: '...'})];
	items.minimalMenu = [[items.toggleStrong, items.toggleEm, items.toggleLink, items.insertMenu], [items.insertEmbed], items.blockDropdownMenu];
	items.embedMenu = [[items.setAlignInline, items.setAlignFull, items.setAlignLeft, items.setAlignRight, items.setSize]];

	return items;
}
exports.buildMenuItems = buildMenuItems;
