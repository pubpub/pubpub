import { DOMSerializer } from 'prosemirror-model';

import Popper from 'popper.js';

require('./notePopover.scss');

const normalizePopoverString = (string) => string.split('\n').join('');

class NotePopover {
	constructor(node, view, unstructuredAttrKey) {
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, node.type.spec.toDOM(node));
		this.dom = dom;
		this.viewContainer = view.dom;
		this.contentDOM = contentDOM;
		this.node = node;
		this.unstructuredAttrKey = unstructuredAttrKey;
		this.setupTooltip = this.setupTooltip.bind(this);
		this.teardownTooltip = this.teardownTooltip.bind(this);
		this.dom.setAttribute('tabindex', '0');
		this.dom.addEventListener('mouseover', this.setupTooltip);
		this.dom.addEventListener('mouseout', this.teardownTooltip);
		this.dom.addEventListener('focus', this.setupTooltip);
		this.dom.addEventListener('blur', this.teardownTooltip);
	}

	setupTooltip() {
		this.teardownTooltip();
		const { citation, [this.unstructuredAttrKey]: unstructuredValue } = this.node.attrs;
		const tooltip = document.createElement('div');
		tooltip.classList.add('note-popover-component', 'bp3-elevation-2');
		tooltip.innerHTML = `
            ${citation ? normalizePopoverString(citation.html) : ''}
            ${unstructuredValue ? normalizePopoverString(unstructuredValue) : ''}
        `;
		document.body.appendChild(tooltip);
		this.tooltip = tooltip;
		this.popper = new Popper(this.dom, tooltip, {
			placement: 'top-start',
			modifiers: {
				flip: {
					behavior: 'flip',
				},
				preventOverflow: {
					boundariesElement: this.viewContainer,
				},
			},
		});
	}

	teardownTooltip() {
		if (this.tooltip) {
			this.tooltip.remove();
			this.popper.destroy();
		}
	}

	destroy() {
		this.teardownTooltip();
		this.dom.removeEventListener('mouseover', this.setupTooltip);
		this.dom.removeEventListener('mouseout', this.teardownTooltip);
		this.dom.removeEventListener('focus', this.setupTooltip);
		this.dom.removeEventListener('blur', this.teardownTooltip);
	}
}

export default NotePopover;
