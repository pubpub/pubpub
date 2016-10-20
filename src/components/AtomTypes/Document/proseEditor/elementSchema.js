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

	initiateProseMirror = ({changeNode, updateMenuCallback, setEmbedAttribute, getState}) => {
		this.updateMenu = updateMenuCallback;
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
				this.updateMenu({
					embedLayoutCoords: undefined,
					embedAttrs: undefined,
					embedWidth: undefined,
				});
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
			console.log('selected same node');
			return;
		}

		if (currentSelectedNode && currentSelectedNode.type.name.indexOf('embed') !== -1) {
			this.updateNodePosition(currentSelectedNode);
		}
	}


	checkAndRender(nodeId) {
		if (nodeId && this.editingElem === nodeId) {
			this.updateNodePosition(this.elementStore[nodeId].node);
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


	updateNodePosition = (currentSelectedNode) => {

		const nodeId = currentSelectedNode.attrs.nodeId;
		const foundNode = this.elementStore[nodeId];
		this.editingElem = nodeId;
		foundNode.element.setSelected(true);

		return;

		if (foundNode.active === false) {
			this.updateMenu({
				embedLayoutCoords: undefined,
				embedAttrs: undefined,
				embedWidth: undefined,
			});
			return;
		}

		foundNode.element.setSelected(true);
		let size = {width: 0, height: 0, left: 0, top: 0};
		if (foundNode) {
			size = foundNode.element.getSize();
		} else {
			console.log('Could not find node');
		}

		const coords = {};
		coords.bottom = size.top;
		coords.left = size.left;
		console.log(size);

		this.editingElem = nodeId;
		this.updateMenu({
			embedLayoutCoords: coords,
			embedAttrs: currentSelectedNode.attrs,
			embedWidth: size.width,
		});

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


	sortNodes = () => {

		let citeCount = 0;

		this.pm.doc.forEach((node, offset, index) => {
			node.forEach((subNode, suboffset, index) => {
					const nodeHash = this.getNodeHash(subNode.attrs);
					if (this.elementStore[nodeHash] && this.elementStore[nodeHash].element.setCiteCount) {
						// debugger;
						this.elementStore[nodeHash].element.setCiteCount(citeCount);
						/*
						console.log(subNode.resolve(0).pos);
						const resolved = subNode.resolve(0).pos;
						const selection = new NodeSelection(resolved);
						citeCount++;
						this.pm.tr.setNodeType(selection.from, currentSelectedNode.type, {...currentSelectedNode.attrs, ['citeCount']: citeCount}).apply();
						console.log('Got element!!');
						*/
					}
			});
		});
		return;
	}
	currentlyEditing = () => {
		return (this.editingElem !== null);
	}
	findNodeById = (domHash) => {
		const element = this.elementStore[domHash];
		if (element && element.node) {
			return element.node.attrs;
		}
		return null;
	}
	findElementById = (domHash) => {
		const element = elementStore[domHash];
		if (element && element.element) {
			return element.element;
		}
		return null;
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
		dom.className += (block) ? 'block-embed' : ' embed';

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


		// this.sortNodes();

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
