import throttle from 'lodash/throttle';
import React from 'react';
import ReactDOM from 'react-dom';

import EmbedWrapper from './EmbedWrapper';
import Pointer from './Pointer';

let absoluteCount = 0;

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

	initiateProseMirror = (pm, updateMenuCallback, setEmbedAttribute) => {
		this.pm = pm;
		this.updateMenu = updateMenuCallback;
		this.setEmbedAttribute = setEmbedAttribute;

		pm.on.selectionChange.add(()=>{
			const currentSelection = pm.selection;
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
				pm.tr.setNodeType(currentFrom, currentSelectedNode.type, {...currentSelectedNode.attrs, ['nodeId']: nodeId}).apply();
				return;
			}

			if (currentSelectedNode && currentSelectedNode.type.name.indexOf('embed') !== -1) {
				this.updateNodePosition(currentSelectedNode);
			}

		});

	}

	checkAndRender(nodeId) {
		if (this.editingElem === nodeId) {
			this.updateNodePosition(this.elementStore[nodeId].node);
		}
	}


	updateNodePosition = (currentSelectedNode) => {

		const nodeId = currentSelectedNode.attrs.nodeId;
		const foundNode = this.elementStore[nodeId];

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
	findNodeById = (domHash) => {
		const element = elementStore[domHash];
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

		if (this.elementStore[nodeId].replaced === true) {
			console.log('got replaced node!', this.elementStore[nodeId].active);
			ReactDOM.unmountComponentAtNode(domElement);
			this.elementStore[nodeId].replaced = false;
			return;
		}

		if (this.elementStore[nodeId].active === false) {
			return;
		}
		console.log('node removed!', nodeId, this.elementStore[nodeId].replaced);
		this.elementStore[nodeId].active = false;
		ReactDOM.unmountComponentAtNode(domElement);
	}

	createElementAtNode = (node, block = false) => {

		const nodeId = node.attrs.nodeId;


		const localCount = absoluteCount;
		absoluteCount++;
		let replaced = false;

		if (this.elementStore[nodeId] && this.elementStore[nodeId].active === true) {
			// this.elementStore[nodeId].active = true;
			console.log('trying to replace an active node');
			// this.elementStore[nodeId].replaced = true;
			replaced = true;
			// this.elementStore[nodeId].active = false;
			/*
			const oldDomNode = this.elementStore[nodeId].dom;
			oldDomNode.removeEventListener('DOMNodeRemoved', this.elementStore[nodeId].listener);
			ReactDOM.unmountComponentAtNode(oldDomNode);
			*/
			// this.elementStore[nodeId].replaced = true;
			// return this.elementStore[nodeId].dom;
		}

		const domParent = document.createElement('span');

		const editing = (this.editingElem === nodeId);

		const reactElement = ReactDOM.render(<EmbedWrapper {...node.attrs}/>, domParent);
		const dom = domParent.childNodes[0];
		dom.className += (block) ? 'block-embed' : ' embed';

		dom.setAttribute('data-nodeId', nodeId);
		const listenerFunc = throttle(this.onRemoveNode.bind(this, nodeId, domParent), 250);
		this.elementStore[nodeId] = {node: node, element: reactElement, active: true, dom: domParent, listener: listenerFunc, replaced: replaced};

		console.log('creating event listener');
		domParent.addEventListener('DOMNodeRemoved', listenerFunc);

		domParent.addEventListener('DOMNodeInserted', (evt) => {
			// console.log('reinserted', absoluteCount);
		});

		domParent.addEventListener('DOMNodeRemovedFromDocument', (evt) => {
			// this.elementStore[nodeId].active = false;
			// ReactDOM.unmountComponentAtNode(domParent);
			// console.log('unrenderingg');
			// delete this.elementStore[nodeId];
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
