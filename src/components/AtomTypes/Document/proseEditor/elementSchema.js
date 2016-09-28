import murmur from 'murmurhash';
import React from 'react';
import ReactDOM from 'react-dom';

import EmbedWrapper from './EmbedWrapper';
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

	initiateProseMirror = (pm, updateMenuCallback, setEmbedAttribute) => {
		this.pm = pm;
		this.updateMenu = updateMenuCallback;
		this.setEmbedAttribute = setEmbedAttribute;

		pm.on.selectionChange.add(()=>{
			const currentSelection = pm.selection;
			const currentSelectedNode = currentSelection.node;

			if (!currentSelectedNode || currentSelectedNode.type.name !== 'embed') {

				if (this.editingElem) {
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
				console.log('Creating node id')
				const nodeId = this.generateNodeId();
				pm.tr.setNodeType(currentFrom, currentSelectedNode.type, {...currentSelectedNode.attrs, ['nodeId']: nodeId}).apply();
				return;
			}


			if (currentSelectedNode && currentSelectedNode.type.name === 'embed') {
				const nodeId = currentSelectedNode.attrs.nodeId;
				const foundNode = this.elementStore[nodeId];
				foundNode.element.setSelected(true);
				let size = {width: 0, height: 0, left: 0, top: 0};
				if (foundNode) {
					size = foundNode.element.getSize();
				} else {
					console.log('Could not find node');
				}

				const coords = pm.coordsAtPos(currentFrom);
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

	createElementAtNode = (node) => {

		const nodeId = node.attrs.nodeId;

		/*
		if (this.elementStore[nodeId] && this.elementStore[nodeId].dom) {
			 console.log('returning old node!');
			 return this.elementStore[nodeId].dom;
		}
		*/

		const domParent = document.createElement('span');

		const editing = (this.editingElem === nodeId);

		const reactElement = ReactDOM.render(<EmbedWrapper editing={editing} {...node.attrs}/>, domParent);
		const dom = domParent.childNodes[0];
		dom.className += ' embed';

		dom.setAttribute('data-nodeId', nodeId);
		this.elementStore[nodeId] = {node: node, element: reactElement, active: true};

		dom.addEventListener('DOMNodeRemovedFromDocument', (evt) => {
			ReactDOM.unmountComponentAtNode(domParent);
			// delete this.elementStore[nodeId];
			// timeout and wait for deletion
			this.elementStore[nodeId].active = false;
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
