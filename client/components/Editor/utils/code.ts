import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import { html } from '@codemirror/lang-html';
import { sql } from '@codemirror/lang-sql';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { css } from '@codemirror/lang-css';

export const languageModes = {
	javascript,
	markdown,
	html,
	sql,
	python,
	cpp,
	java,
	php,
	css,
};

export const languages = [
	'html',
	'javascript',
	'markdown',
	'sql',
	'python',
	'cpp',
	'java',
	'css',
	'php',
] as const;

export type LanguageName = typeof languages[number];
