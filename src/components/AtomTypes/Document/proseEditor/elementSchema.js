import murmur from 'murmurhash';
import React from 'react';
import ReactDOM from 'react-dom';

import EmbedWrapper from './EmbedWrapper';

class ElementSchema {
	constructor() {
		this.elementStore = {};
	}
	reInit() {
		this.elementStore = {};
	}

	initiateProseMirror = (pm) => {
		this.pm = pm;

		/*
		pm.on.selectionChange.add(()=>{
			const currentSelection = pm.selection;
			const currentFrom = currentSelection.$from.pos;
			const currentSelectedNode = currentSelection.node;
			if (currentSelectedNode && currentSelectedNode.type.name === 'embed') {
				console.log(currentSelectedNode.type.attrs);
				console.log(currentSelectedNode.type.attrs.reactElement);
				const nodeHash = this.getNodeHash(currentSelectedNode.type.attrs);

				if (this.elementStore[nodeHash] && this.elementStore[nodeHash].element.setCiteCount) {
					this.elementStore[nodeHash].element.setCiteCount(citeCount);
				}

			} else {
				this.setState({
					embedLayoutCoords: undefined,
					embedAttrs: undefined,
				});
			}
		});
		*/


	}

	sortNodes = () => {

		let citeCount = 0;

		this.pm.doc.forEach((node, offset, index) => {
			node.forEach((subNode, offset, index) => {
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
	findNodeByHash = (domHash) => {
		const element = elementStore[domHash];
		if (element && element.node) {
			return element.node.attrs;
		}
		return null;
	}
	findElementByHash = (domHash) => {
		const element = elementStore[domHash];
		if (element && element.element) {
			return element.element;
		}
		return null;
	}

	getNodeHash = (nodeAttrs) => {
		return murmur.v3(JSON.stringify(nodeAttrs));
	}

	creatElementAtNode = (node) => {

		const domParent = document.createElement('span');

		const reactElement = ReactDOM.render(<EmbedWrapper {...node.attrs}/>, domParent);
		const dom = domParent.childNodes[0];
		dom.className += ' embed';
		const nodeHash = murmur.v3(JSON.stringify(node.attrs));
		dom.setAttribute('data-nodeHash', nodeHash);
		this.elementStore[nodeHash] = {node: node, element: reactElement};

		dom.addEventListener('DOMNodeRemovedFromDocument', (evt) => {
			ReactDOM.unmountComponentAtNode(domParent);
			delete this.elementStore[nodeHash];
		});

		this.sortNodes();

		return domParent;

	}

}

export default new ElementSchema();
