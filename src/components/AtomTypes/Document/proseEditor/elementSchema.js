import React from 'react';
import ReactDOM from 'react-dom';

import EmbedEditWrapper from './EmbedEditWrapper';
import Pointer from './Pointer';

class ElementSchema {
	constructor() {
		this.elementStore = {};
		this.editingElem = null;
	}
	reInit() {
		this.elementStore = {};
	}

	generateNodeId() {
		return Math.floor(Math.random() * 10000000);
	}

	initiateProseMirror = ({changeNode, setEmbedAttribute, getState}) => {
		this.setEmbedAttribute = setEmbedAttribute;
		this.changeNode = changeNode;
		this.getState = getState;
	}

	checkNodeEditing = (node) => {
		if (node && node.attrs && node.attrs.nodeId === this.editingElem) {
			return true;
		}
		return false;
	}

	checkNodeSelect = (selection) => {
		const currentSelectedNode = selection.node;
		if (currentSelectedNode && currentSelectedNode.attrs && currentSelectedNode.attrs.nodeId === this.editingElem) {
			return true;
		}
		return false;
	}

	onNodeSelect = (state, selection) => {
		const currentSelection = selection;
		const currentSelectedNode = currentSelection.node;

		if (!currentSelectedNode || currentSelectedNode.type.name.indexOf('embed') === -1) {

			if (this.editingElem && this.elementStore[this.editingElem] && this.elementStore[this.editingElem].active === true) {
				this.elementStore[this.editingElem].element.setSelected(false);
				this.editingElem = null;
			}

			return;
		}
		const currentFrom = currentSelection.$from.pos;

		if (!currentSelectedNode.attrs.nodeId) {
			const nodeId = this.generateNodeId();
			this.changeNode(currentFrom, currentSelectedNode.type, {...currentSelectedNode.attrs, ['nodeId']: nodeId});
			return;
		}

		if (currentSelectedNode.attrs.nodeId === this.editingElem) {
			return;
		}

		if (currentSelectedNode && currentSelectedNode.type.name.indexOf('embed') !== -1) {
			this.updateNodePosition(currentSelectedNode);
		}
	}


	checkPoint = (point) => {
		const node = this.elementStore[this.editingElem];
		const dom = (node) ? node.dom : null;

		if (!dom.contains(point)) {
			node.element.setSelected(false);
			this.editingElem = null;
			return true;
		}

		return false;

	}

	focusCaption = () => {
		const node = this.elementStore[this.editingElem];
		const dom = (node) ? node.dom : null;

		if (node) {
			node.element.focusCaption();
		}

	}

	findNodeById = (nodeId) => {
		if (this.elementStore[nodeId]) {
			return this.elementStore[nodeId].node;
		}
		return null;
	}

	updateNodePosition = (currentSelectedNode) => {

		const nodeId = currentSelectedNode.attrs.nodeId;
		const foundNode = this.elementStore[nodeId];
		this.editingElem = nodeId;
		foundNode.element.setSelected(true);
		return;
	}

	updateNodeParams = (nodeId, newAttrs) => {

		const currentSelection = this.getState().selection;
		const currentFrom = currentSelection.$from.pos;
		const currentSelectedNode = currentSelection.node;

		const oldNodeAttrs = currentSelectedNode.attrs;

		if (oldNodeAttrs.nodeId !== nodeId) {
			console.log('Trying to update a node that isnt selected');
			return;
		}

		let nodeType = currentSelectedNode.type;
		const schema = currentSelectedNode.type.schema;
		/*
		if (key === 'align') {
			if (value === 'inline') {
				nodeType = schema.nodes.embed;
			} else {
				nodeType = schema.nodes.block_embed;
			}
		}
		*/

		this.changeNode(currentFrom, currentSelectedNode.type, {...oldNodeAttrs, ...newAttrs});
	}

	getElementsInDocument = (nodeType) => {

		if (!this.getState()) {
			return;
		}

		const nodesOfType = [];

		const processNode = (processedNode) => {
			const nodeAttrs = processedNode.attrs;
			const nodeId = processedNode.attrs.nodeId;
			const node = this.elementStore[nodeId];
			if (node && node.element && nodeAttrs.type === nodeType && nodeAttrs.data) {
				nodesOfType.push(nodeAttrs.data);
			}
		};

		this.loopThroughAllNodes(processNode);

		return nodesOfType;

	}

	loopThroughAllNodes = (nodeFunc) => {

		const editorState = this.getState();

		const nodeLoop = (node, offset, index) => {
			nodeFunc(node);
			node.forEach(nodeLoop);
		};

		editorState.doc.forEach(nodeLoop);
	}

	countNodes = (state) => {

		let citeCount = 0;
		const editorState = this.getState();

		if (!editorState) {
			return;
		}

		const citeCounts = {};

		const countNode = (processNode) => {
			const nodeAttrs = processNode.attrs;
			const nodeId = processNode.attrs.nodeId;
			const node = this.elementStore[nodeId];
			if (node && node.element && nodeAttrs.mode === 'cite' && nodeAttrs.data) {

				let refCount = citeCounts[nodeAttrs.data._id];

				if (!refCount) {
					citeCount++;
					refCount = citeCount;
					citeCounts[nodeAttrs.data._id] = refCount;
				}

				if (node.count !== refCount) {
					node.element.setCiteCount(refCount);
					node.count = refCount;
				}
			}
		};

		this.loopThroughAllNodes(countNode);

		return;
	}

	currentlyEditing = () => {
		return (this.editingElem !== null);
	}

	onRemoveNode = (nodeId, domElement, evt) => {
		// console.log('trying to underender!');
		return;
		ReactDOM.unmountComponentAtNode(domElement);
	}

	unmountNode = (node) => {
		const nodeId = node.attrs.nodeId;
		if (nodeId && this.elementStore[nodeId]) {
			const domElement = this.elementStore[nodeId].dom;
			ReactDOM.unmountComponentAtNode(domElement);
		}
	}

	serializeNode = (node) => {
		const nodeId = node.attrs.nodeId;
		const foundNode = this.elementStore[nodeId];
		if (!foundNode) {
			return null;
		}
		const clonedNode = foundNode.dom.cloneNode(true);
		clonedNode.className = "pub-embed block-embed";
		return clonedNode;
	}

	createElementAtNode = (node, block = false) => {

		const nodeId = node.attrs.nodeId;

		const domParent = document.createElement('span');
		let domChild;

		if (nodeId && this.elementStore[nodeId]) {
		 	domChild = this.elementStore[nodeId].dom;
			domChild.parentNode.removeChild(domChild);
		} else {
			domChild = document.createElement('span');
		}

		const reactElement = ReactDOM.render(<EmbedEditWrapper updateParams={this.updateNodeParams} {...node.attrs}/>, domChild);
		const dom = domChild.childNodes[0];
		if (block && dom.className.indexOf('block-embed') === -1) {
			dom.className += ' block-embed';
		} else if (dom.className.indexOf(' embed') === -1) {
			dom.className += ' embed';
		}

		domParent.appendChild(domChild);

		dom.setAttribute('data-nodeId', nodeId);


		// const listenerFunc = once(this.onRemoveNode.bind(this, nodeId, domParent));
		this.elementStore[nodeId] = {node: node, element: reactElement, active: true, dom: domChild};

		// domParent.addEventListener('DOMNodeRemoved', listenerFunc);

		domParent.addEventListener('DOMNodeInserted', (evt) => {
			// console.log('reinserted', absoluteCount);
		});

		domParent.addEventListener('DOMNodeRemovedFromDocument', (evt) => {

			/*
			this.elementStore[nodeId].active = false;
			ReactDOM.unmountComponentAtNode(domParent);
			console.log('unrenderingg');
			delete this.elementStore[nodeId];
			*/
			// timeout and wait for deletion

		});


		this.countNodes();

		return domParent;

	}

	createPointerAtNode = (node) => {

		const domParent = document.createElement('span');

		const reactElement = ReactDOM.render(<Pointer {...node.attrs}/>, domParent);
		const dom = domParent.childNodes[0];
		const figureName = node.attrs.figureName;
		dom.className += ' pointer';
		dom.setAttribute('data-figureName', figureName);

		dom.addEventListener('DOMNodeRemovedFromDocument', (evt) => {
			ReactDOM.unmountComponentAtNode(domParent);
		});

		return domParent;
	}


}

export default new ElementSchema();
