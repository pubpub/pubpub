export function isDescendantOfP(child) {
	let node = child;
	while (node !== null) {
		if (node.className === 'p-block') {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

export function getAncestorText(child) {
	let node = child;
	while (node !== null) {
		if (node.className === 'p-block') {
			return node.innerText;
		}
		node = node.parentNode;
	}
	return null;
}

export function clearTempHighlights() {
	const temps = document.getElementsByClassName('tempHighlight');
	while (temps.length) {
		for (let index = 0; index < temps.length; index += 1) {
			temps[index].classList.remove('tempHighlight');
		}	
	}
}
