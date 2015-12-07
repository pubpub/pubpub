export function isDescendantOfP(child) {
	let node = child.parentNode;
	while (node !== null) {
		if (node.nodeName === 'P') {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

export function getAncestorText(child) {
	let node = child.parentNode;
	while (node !== null) {
		if (node.nodeName === 'P') {
			return node.innerText;
		}
		node = node.parentNode;
	}
	return null;
}
