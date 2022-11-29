import { cppLanguage } from '@codemirror/lang-cpp';
import { cssLanguage } from '@codemirror/lang-css';
import { htmlLanguage } from '@codemirror/lang-html';
import { phpLanguage } from '@codemirror/lang-php';
// import { sqlLanguage } from '@codemirror/lang-sql';
import { xmlLanguage } from '@codemirror/lang-xml';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { javaLanguage } from '@codemirror/lang-java';
import { jsonLanguage } from '@codemirror/lang-json';
import { lezerLanguage } from '@codemirror/lang-lezer';
// import { markdownLanguage } from '@codemirror/lang-markdown';
import { pythonLanguage } from '@codemirror/lang-python';
import { rustLanguage } from '@codemirror/lang-rust';
import { wastLanguage } from '@codemirror/lang-wast';

import { Parsers } from './types';

const parsers: Parsers = {
	cpp: cppLanguage.parser,
	css: cssLanguage.parser,
	html: htmlLanguage.parser,
	php: phpLanguage.parser,
	// sql: sqlLanguage.parser,
	xml: xmlLanguage.parser,
	javascript: javascriptLanguage.parser,
	java: javaLanguage.parser,
	json: jsonLanguage.parser,
	lezer: lezerLanguage.parser,
	// markdown: markdownLanguage.parser,
	python: pythonLanguage.parser,
	rust: rustLanguage.parser,
	wast: wastLanguage.parser,
};

export default parsers;
