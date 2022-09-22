// TODO ask Eric about how to combine the below types into one type
export const languageNames = [
	'javascript',
	'markdown',
	'html',
	'sql',
	'python',
	'cpp',
	'java',
	'php',
	'css',
] as const;

export type LanguageName = typeof languageNames[number];

type ModeSpec = {
	label: string;
	importMode: any; // TODO how should this be typed?
};

export const languageModes: Record<LanguageName, ModeSpec> = {
	javascript: {
		label: 'javascript',
		importMode: () => import('@codemirror/lang-javascript'),
	},
	markdown: {
		label: 'markdown',
		importMode: () => import('@codemirror/lang-markdown'),
	},
	html: {
		label: 'html',
		importMode: () => import('@codemirror/lang-html'),
	},
	sql: {
		label: 'sql',
		importMode: () => import('@codemirror/lang-sql'),
	},
	python: {
		label: 'python',
		importMode: () => import('@codemirror/lang-python'),
	},
	cpp: {
		label: 'c++',
		importMode: () => import('@codemirror/lang-cpp'),
	},
	java: {
		label: 'java',
		importMode: () => import('@codemirror/lang-java'),
	},
	php: {
		label: 'php',
		importMode: () => import('@codemirror/lang-php'),
	},
	css: {
		label: 'css',
		importMode: () => import('@codemirror/lang-css'),
	},
};
