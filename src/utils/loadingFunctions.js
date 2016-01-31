export function loadCss(path) {
	if (!path) { return; }
	const head = document.getElementsByTagName('head')[0];
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = path;
	link.media = 'all';
	head.appendChild(link);
}

const timeout = {};
export function debounce(timerName, func, wait, immediate) {
	return function() {
		const context = this;
		const args = arguments;
		const later = function() {
			timeout[timerName] = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout[timerName];
		clearTimeout(timeout[timerName]);
		timeout[timerName] = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

export function makeURLCompatible(string) {
	return string.replace(' ', '_');
}
