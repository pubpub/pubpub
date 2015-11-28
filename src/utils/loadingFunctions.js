export function loadCss(path) {
	const head  = document.getElementsByTagName('head')[0];
	const link  = document.createElement('link');
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = '/css/codemirror.css';
	link.media = 'all';
	head.appendChild(link);
}
