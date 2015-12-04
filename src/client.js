/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import createStore from './createStore';
import ApiClient from './helpers/ApiClient';
// import io from 'socket.io-client';
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';

import getRoutes from './routes';
import makeRouteHooksSafe from './helpers/makeRouteHooksSafe';

const client = new ApiClient();
import Html from './helpers/Html';

const scrollablehistory = useScroll(createHistory);
// const scrollablehistory = createHistory; // Had to turn off scrollable because of how it messes when we use queries

const dest = document.getElementById('content');
const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), scrollablehistory, client, window.__INITIAL_STATE__);

const component = (
	<Provider store={store} key="provider">
		<ReduxRouter routes={getRoutes(store, history)} />
	</Provider>
);

const mainHTML = <Html component={component} />;
ReactDOM.render(mainHTML, dest);

if (process.env.NODE_ENV !== 'production') {
	window.React = React; // enable debugger

	if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
		console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
	}
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
	require('./containers/DevTools/createDevToolsWindow')(store);
}


/*
const WORD = /[\w$]+/;
const RANGE = 500;

CodeMirror.registerHelper('hint', 'anyword', function(editor, options) {
	const word = options && options.word || WORD;
	const range = options && options.range || RANGE;
	const cur = editor.getCursor();
	const curLine = editor.getLine(cur.line);
	const end = cur.ch;
	let start = end;
	while (start && word.test(curLine.charAt(start - 1))) --start;
	const curWord = start !== end && curLine.slice(start, end);

	const list = options && options.list || [];
	const seen = {};
	const re = new RegExp(word.source, 'g');
	for (let dir = -1; dir <= 1; dir += 2) {
		let line = cur.line;
		const endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
		for (; line !== endLine; line += dir) {
			const text = editor.getLine(line);
			let match = re.exec(text);
			while (match) {
				if (line === cur.line && match[0] === curWord) continue;
				if ((!curWord || match[0].lastIndexOf(curWord, 0) === 0) && !Object.prototype.hasOwnProperty.call(seen, match[0])) {
					seen[match[0]] = true;
					list.push(match[0]);
				}
				match = re.exec(text);
			}
		}
	}
	return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
});
*/
