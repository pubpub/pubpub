import {MarkdownSerializer} from 'prosemirror/dist/markdown';

export const markdownSerializer = new MarkdownSerializer({
	blockquote(state, node) {
		state.wrapBlock('> ', null, node, () => state.renderContent(node));
	},
	code_block(state, node) {
		if (node.attrs.params === null) {
			state.wrapBlock('    ', null, node, () => state.text(node.textContent, false));
		} else {
			state.write('```' + node.attrs.params + '\n');
			state.text(node.textContent, false);
			state.ensureNewLine();
			state.write('```');
			state.closeBlock(node);
		}
	},
	heading(state, node) {
		state.write(state.repeat('#', node.attrs.level) + ' ');
		state.renderInline(node);
		state.closeBlock(node);
	},
	horizontal_rule(state, node) {
		state.write(node.attrs.markup || '---');
		state.closeBlock(node);
	},
	page_break(state, node) {
		state.write(node.attrs.markup || '{{pagebreak}}');
		state.closeBlock(node);
	},
	bullet_list(state, node) {
		state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
	},
	ordered_list(state, node) {
		const start = node.attrs.order || 1;
		const maxW = String(start + node.childCount - 1).length;
		const space = state.repeat(' ', maxW + 2);
		state.renderList(node, space, index => {
			const nStr = String(start + index);
			return state.repeat(' ', maxW - nStr.length) + nStr + '. ';
		});
	},
	list_item(state, node) {
		state.renderContent(node);
	},
	paragraph(state, node) {
		state.renderInline(node);
		state.closeBlock(node);
	},
	image(state, node) {
		state.write('![' + state.esc(node.attrs.alt || '') + '](' + state.esc(node.attrs.src) + (node.attrs.title ? ' ' + state.quote(node.attrs.title) : '') + ')');
	},
	embed(state, node) {
		state.write('[[source=\"' + node.attrs.source + '\" id=\"' + node.attrs.id + '\" className=\"' + node.attrs.className + '\" align=\"' + node.attrs.align + '\" size=\"' + node.attrs.size + '\" caption=\"' + node.attrs.caption + '\" data=\"' + encodeURIComponent(JSON.stringify(node.attrs.data)) + '\"]]');
	},
	emoji(state, node) {
		state.write(':' + node.attrs.markup + ':');
	},
	hard_break(state) {
		state.write('\\\n');
	},
	text(state, node) {
		state.text(node.text);
	},
}, {
	em: {open: '*', close: '*', mixable: true},
	strong: {open: '**', close: '**', mixable: true},
	sub: {open: '~', close: '~', mixable: true},
	sup: {open: '^', close: '^', mixable: true},
	link: {
		open: '[',
		close(state, mark) {
			return '](' + state.esc(mark.attrs.href) + (mark.attrs.title ? ' ' + state.quote(mark.attrs.title) : '') + ')';
		}
	},
	code: {open: '`', close: '`'}
});
