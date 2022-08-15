import { EditorView as CodeMirror, keymap as cmKeymap, drawSelection } from '@codemirror/view';
import { EditorView } from 'prosemirror-view';
import { TextSelection, Selection } from 'prosemirror-state';
import { Node, Fragment } from 'prosemirror-model';
import { javascript } from '@codemirror/lang-javascript';
import { defaultKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

import { exitCode } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';

export default class CodeBlockView {
	private node: Node;
	private cm: CodeMirror;
	private getPos: any;
	private view: EditorView;
	dom: HTMLElement;
	private updating: boolean;
	constructor(node: Node, view: EditorView, getPos) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;

		this.cm = new CodeMirror({
			doc: this.node.textContent || undefined,
			extensions: [
				cmKeymap.of([...this.codeMirrorKeymap(), ...defaultKeymap]),
				drawSelection(),
				syntaxHighlighting(defaultHighlightStyle),
				javascript(),
				CodeMirror.updateListener.of((update) => this.forwardUpdate(update)),
			],
		});

		this.dom = this.cm.dom;
		// This flag is used to avoid an update loop between the outer and
		// inner editor
		this.updating = false;
	}

	forwardUpdate(update) {
		if (this.updating || !this.cm.hasFocus) return;
		let offset = this.getPos() + 1;
		const { main } = update.state.selection;
		const selection = TextSelection.create(
			this.view.state.doc,
			offset + main.from,
			offset + main.to,
		);
		if (update.docChanged || !this.view.state.selection.eq(selection)) {
			const tr = this.view.state.tr.setSelection(selection);
			update.changes.iterChanges(
				(fromA: number, toA: number, fromB: number, toB: number, text: Text) => {
					const textText = text.toString();
					tr.replaceWith(
						offset + fromA,
						offset + toA,
						textText ? this.view.state.schema.text(textText) : Fragment.empty,
					);
					offset += toB - fromB - (toA - fromA);
				},
			);
			this.view.dispatch(tr);
		}
	}

	setSelection(anchor, head) {
		this.cm.focus();
		this.updating = true;
		this.cm.dispatch({ selection: { anchor, head } });
		this.updating = false;
	}

	codeMirrorKeymap() {
		const view = this.view;
		return [
			{ key: 'ArrowUp', run: () => this.maybeEscape('line', -1) },
			{ key: 'ArrowLeft', run: () => this.maybeEscape('char', -1) },
			{ key: 'ArrowDown', run: () => this.maybeEscape('line', 1) },
			{ key: 'ArrowRight', run: () => this.maybeEscape('char', 1) },
			{
				key: 'Ctrl-Enter',
				run: () => {
					if (!exitCode(view.state, view.dispatch)) return false;
					view.focus();
					return true;
				},
			},
			{ key: 'Ctrl-z', mac: 'Cmd-z', run: () => undo(view.state, view.dispatch) },
			{ key: 'Shift-Ctrl-z', mac: 'Shift-Cmd-z', run: () => redo(view.state, view.dispatch) },
			{ key: 'Ctrl-y', mac: 'Cmd-y', run: () => redo(view.state, view.dispatch) },
		];
	}

	maybeEscape(unit: 'line' | 'char', dir: -1 | 1) {
		const { state } = this.cm;
		const { main } = state.selection;
		if (!main.empty) return false;
		let tempMain: any;
		if (unit === 'line') tempMain = state.doc.lineAt(main.head);
		tempMain = tempMain || main;
		if (dir < 0 ? tempMain.from > 0 : tempMain.to < state.doc.length) return false;
		const targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize);
		const selection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
		const tr = this.view.state.tr.setSelection(selection).scrollIntoView();
		this.view.dispatch(tr);
		this.view.focus();
		return true;
	}

	update(node: Node) {
		if (node.type !== this.node.type) return false;
		this.node = node;
		if (this.updating) return true;
		const newText = node.textContent;
		const curText = this.cm.state.doc.toString();
		if (newText !== curText) {
			let start = 0;
			let curEnd = curText.length;
			let newEnd = newText.length;
			while (start < curEnd && curText.charCodeAt(start) === newText.charCodeAt(start)) {
				++start;
			}
			while (
				curEnd > start &&
				newEnd > start &&
				curText.charCodeAt(curEnd - 1) === newText.charCodeAt(newEnd - 1)
			) {
				curEnd--;
				newEnd--;
			}
			this.updating = true;
			this.cm.dispatch({
				changes: {
					from: start,
					to: curEnd,
					insert: newText.slice(start, newEnd),
				},
			});
			this.updating = false;
		}
		return true;
	}

	selectNode() {
		this.cm.focus();
	}

	stopEvent() {
		return true;
	}
}
