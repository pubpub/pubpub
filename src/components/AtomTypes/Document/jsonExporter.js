/* eslint id-length: [2, { "exceptions": ["a", "t", "i", "c"] }] */

/** Same functionality as objToNode/nodeToObj in diffDOM.js, but also offers output in XHTML format (obj2Node) and without form support. */
export const obj2Node = function(obj, docType) {
	let parser;
	if (obj === undefined) {
		return false;
	}
	if (docType === 'xhtml') {
		parser = new window.DOMParser().parseFromString('<xml/>', 'text/xml');
	} else {
		parser = document;
	}

	function inner(object, insideSvg) {
		let insideSvgParam = insideSvg;
		let node;
		if (object.hasOwnProperty('t')) {
			node = parser.createTextNode(object.t);
		} else if (object.hasOwnProperty('co')) {
			node = parser.createComment(object.co);
		} else {
			if (object.nn === 'svg' || insideSvgParam) {
				node = parser.createElementNS('http://www.w3.org/2000/svg', object.nn);
				insideSvgParam = true;
			} else if (object.nn === 'script') {
				// Do not allow scripts
				return parser.createTextNode('');
			} else {
				node = parser.createElement(object.nn);
			}
			if (object.a) {
				for (let i = 0; i < object.a.length; i++) {
					node.setAttribute(object.a[i][0], object.a[i][1]);
				}
			}
			if (object.c) {
				for (let i = 0; i < object.c.length; i++) {
					node.appendChild(inner(object.c[i], insideSvgParam));
				}
			}
		}
		return node;
	}
	return inner(obj);
};

export const node2Obj = function(node) {
	const obj = {};

	if (node.nodeType === 3) {
		obj.t = node.data;
	} else if (node.nodeType === 8) {
		obj.co = node.data;
	} else {
		obj.nn = node.nodeName;
		if (node.attributes && node.attributes.length > 0) {
			obj.a = [];
			for (let i = 0; i < node.attributes.length; i++) {
				obj.a.push([node.attributes[i].name, node.attributes[i].value]);
			}
		}
		if (node.childNodes && node.childNodes.length > 0) {
			obj.c = [];
			for (let i = 0; i < node.childNodes.length; i++) {
				if (node.childNodes[i]) {
					obj.c.push(node2Obj(node.childNodes[i]));
				}
			}
		}
	}
	return obj;
};
