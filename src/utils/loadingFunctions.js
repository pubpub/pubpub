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
