import murmur from 'murmurhash';
import React from 'react';
import ReactDOM from 'react-dom';

import EmbedWrapper from './EmbedWrapper';
import Pointer from './Pointer';

class ElementSchema {
	constructor() {
		this.elementStore = {};
	}
	reInit() {
		this.elementStore = {};
	}

	generateNodeId() {
		return Math.floor(Math.random() * 10000000);
	}

	initiateProseMirror = (pm, updateMenuCallback) => {
		this.pm = pm;
		this.updateMenu = updateMenuCallback;

		pm.on.selectionChange.add(()=>{
			const currentSelection = pm.selection;
			const currentSelectedNode = currentSelection.node;

			if (!currentSelectedNode || currentSelectedNode.type.name !== 'embed') {
				return;
			}
			const currentFrom = currentSelection.$from.pos;

			console.log(currentSelectedNode);
			if (!currentSelectedNode.attrs.nodeId) {
				console.log('Creating node id')
				const nodeId = this.generateNodeId();
				pm.tr.setNodeType(currentFrom, currentSelectedNode.type, {...currentSelectedNode.attrs, ['nodeId']: nodeId}).apply();
				return;
			}



			if (currentSelectedNode && currentSelectedNode.type.name === 'embed') {
				const nodeId = currentSelectedNode.attrs.nodeId;
				const foundNode = this.elementStore[nodeId];
				if (foundNode) {
					console.log('Got size', foundNode.element.getSize());
				}

				const coords = pm.coordsAtPos(currentFrom);
				coords.bottom = coords.bottom + window.scrollY - 40;
				this.updateMenu({
					embedLayoutCoords: coords,
					embedAttrs: currentSelectedNode.attrs,
				});

			} else {
				this.updateMenu({
					embedLayoutCoords: undefined,
					embedAttrs: undefined,
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

		const domParent = document.createElement('span');

		const reactElement = ReactDOM.render(<EmbedWrapper {...node.attrs}/>, domParent);
		const dom = domParent.childNodes[0];
		dom.className += ' embed';
		const nodeId = node.attrs.nodeId;
		dom.setAttribute('data-nodeId', nodeId);
		this.elementStore[nodeId] = {node: node, element: reactElement};

		dom.addEventListener('DOMNodeRemovedFromDocument', (evt) => {
			ReactDOM.unmountComponentAtNode(domParent);
			delete this.elementStore[nodeId];
		});

		// this.sortNodes();

		return domParent;


	}

	getNodesAt = () => {

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

	generateId = () => {

	}


}

export default new ElementSchema();
