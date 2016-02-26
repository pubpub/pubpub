/* global Raven */

/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
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

import ga from 'react-ga';
import mixpanel from 'mixpanel-browser';
ga.initialize('UA-61723493-3');
mixpanel.init('f85adcbd0f97f6101ebd440e931197b2');

const client = new ApiClient();
import Html from './helpers/Html';

const scrollablehistory = useScroll(createHistory);

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
} else {
	Raven.config('https://270b7f0834134ee9afb6d1834933f583@app.getsentry.com/68428').install();

	const username = store.getState().login.getIn(['userData', 'username']);
	if (username) {
		Raven.setUserContext({ username: username });
	}
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
	require('./containers/DevTools/createDevToolsWindow')(store);
}
