import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import NotePopover from './NotePopover';

class ReferenceView {
	view: EditorView;
	dom: HTMLAnchorElement;
	contentDOM: HTMLAnchorElement;

	constructor(node: Node, view: EditorView) {
		const { targetId, label } = node.attrs;

		this.view = view;
		this.dom = this.contentDOM = document.createElement('a');

		this.dom.textContent = label || `(ref?)`;
		this.dom.classList.add('reference');
		this.dom.classList.add('testy');
		this.dom.setAttribute('data-node-type', 'reference');
		this.dom.setAttribute('data-target-id', targetId);
		this.dom.setAttribute('href', `#${targetId}`);

		this.onClick = this.onClick.bind(this);

		this.dom.addEventListener('click', this.onClick);
	}

	onClick(e: MouseEvent) {
		if (this.view.editable) {
			e.preventDefault();
		}
	}

	stopEvent() {
		return this.view.editable;
	}

	destroy() {
		this.dom.removeEventListener('click', this.onClick);
	}
}

export default {
	citation: (node, view) => new NotePopover(node, view, 'unstructuredValue'),
	footnote: (node, view) => new NotePopover(node, view, 'value'),
	reference: (node, view) => new ReferenceView(node, view),
};
