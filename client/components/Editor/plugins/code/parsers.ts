// the lezer parsers that @codemirror depends on
import { parser as cppParser } from '@lezer/cpp';
import { parser as cssParser } from '@lezer/css';
import { parser as htmlParser } from '@lezer/html';
import { parser as phpParser } from '@lezer/php';
import { parser as xmlParser } from '@lezer/xml';
import { parser as javascriptParser } from '@lezer/javascript';
import { parser as javaParser } from '@lezer/java';
import { parser as jsonParser } from '@lezer/json';
import { parser as markdownParser } from '@lezer/markdown';
import { parser as pythonParser } from '@lezer/python';
import { parser as rustParser } from '@lezer/rust';

// the  few we need from codemirror
import { sql } from '@codemirror/lang-sql';
import { lezerLanguage } from '@codemirror/lang-lezer';
import { wastLanguage } from '@codemirror/lang-wast';

import { Parsers } from './types';

const parsers: Parsers = {
	cpp: cppParser,
	css: cssParser,
	html: htmlParser,
	php: phpParser,
	sql: sql().language.parser,
	xml: xmlParser,
	javascript: javascriptParser,
	java: javaParser,
	json: jsonParser,
	lezer: lezerLanguage.parser,
	markdown: markdownParser,
	python: pythonParser,
	rust: rustParser,
	wast: wastLanguage.parser,
};

export default parsers;
