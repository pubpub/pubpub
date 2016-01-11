import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './createStore';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import Helmet from 'react-helmet';

import {ReduxRouter} from 'redux-router';
import createHistory from 'history/lib/createMemoryHistory';
import {reduxReactRouter, match} from 'redux-router/server';
import {Provider} from 'react-redux';
import qs from 'query-string';
import getRoutes from './routes';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
	target: 'http://localhost:' + config.apiPort,
	ws: true
});

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(require('serve-static')(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
	proxy.web(req, res);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
	let json;
	if (error.code !== 'ECONNRESET') {
		console.error('proxy error', error);
	}
	if (!res.headersSent) {
		res.writeHead(500, {'content-type': 'application/json'});
	}

	json = {error: 'proxy_error', reason: error.message};
	res.end(JSON.stringify(json));
});

app.use((req, res) => {
	if (__DEVELOPMENT__) {
		// Do not cache webpack stats: the script file would change since
		// hot module replacement is enabled in the development env
		webpackIsomorphicTools.refresh();
	}
	const client = new ApiClient(req);

	const store = createStore(reduxReactRouter, getRoutes, createHistory, client);

	function hydrateOnClient() {
		res.send('<!doctype html>\n' +
			ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
	}

	if (__DISABLE_SSR__) {
		hydrateOnClient();
		return;
	}

	store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {
		if (redirectLocation) {
			res.redirect(redirectLocation.pathname + redirectLocation.search);
		} else if (error) {
			console.error('ROUTER ERROR:', pretty.render(error));
			res.status(500);
			hydrateOnClient();
		} else if (!routerState) {
			res.status(500);
			hydrateOnClient();
		} else {
			// Workaround redux-router query string issue:
			// https://github.com/rackt/redux-router/issues/106
			if (routerState.location.search && !routerState.location.query) {
				routerState.location.query = qs.parse(routerState.location.search);
			}

			store.getState().router.then(() => {

				const component = (
					<Provider store={store} key="provider">
						<ReduxRouter/>
					</Provider>
				);

				const status = getStatusFromRoutes(routerState.routes);
				if (status) {
					res.status(status);
				}

				const htmltest = ReactDOM.renderToString(
					<Html radiumConfig={{userAgent: req.headers['user-agent']}} component={component} />
				)
				const mainBundle = webpackIsomorphicTools.assets().javascript.main;
				const head = Helmet.rewind();
				res.send(`<!doctype html>
					<html lang="en-us">
						<head>
							<meta charSet="utf-8"/>
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<meta name="google-site-verification" content="jmmJFnkSOeIEuS54adOzGMwc0kwpsa8wQ-L4GyPpPDg" />
							<meta name="referrer" content="always">

							${head.title.toString()}
							${head.meta.toString()}

							<link rel="shortcut icon" href="/favicon.ico" />
							<link href='https://fonts.googleapis.com/css?family=Lato:300,300italic,700,700italic,900italic|Lora:400,400italic,700,700italic' rel='stylesheet' type='text/css' />

							<!-- We could dynamically load these in Editor.jsx
							<!-- If we have to load more local css - we should bundle it all into one minified file and load it here. -->
							<link href='/css/codemirror.css' rel='stylesheet' type='text/css' /> <!-- I went back to loaded this one because the async css load was causing flicker on Discussion Codemirror -->
							<link href='/css/print.css' rel='stylesheet' type='text/css' />
							<link href='/css/highlightdefault.css' rel='stylesheet' type='text/css' />
							<link href='/css/react-select.min.css' rel='stylesheet' type='text/css' />

							<link href='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/addon/hint/show-hint.css' rel='stylesheet' type='text/css' />
							<!-- We could dynamically load these in Editor.jsx
							This would prevent us from forcing every user to load the libraries - given that many will not edit -->
							<script src="https://cdn.firebase.com/js/client/2.2.4/firebase.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.2.0/codemirror.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/addon/display/placeholder.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/addon/hint/show-hint.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/addon/mode/simple.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/addon/mode/multiplex.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.4.0/addon/mode/overlay.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.2.0/mode/markdown/markdown.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.2.0/mode/css/css.min.js"></script>
							<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.2.0/mode/javascript/javascript.min.js"></script>
							<script src="https://cdn.firebase.com/libs/firepad/1.2.0/firepad.min.js"></script>
							<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>
							
							<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/highlight.min.js"></script>
							<script src="/js/typo.js"></script>
							<script src="/js/spellcheck.js"></script>

						</head>

						<body style="width: 100%; margin: 0;">
							<div id="content">${htmltest}</div>
							<script>
					          window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};
					        </script>
							<script src=${mainBundle}></script>
						</body>
					</html>
					`)

			}).catch((err) => {
				console.error('DATA FETCHING ERROR:', pretty.render(err));
				res.status(500);
				hydrateOnClient();
			});
		}
	}));
});

if (config.port) {

	server.listen(config.port, (err) => {
		if (err) {
			console.error(err);
		}
		console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
		console.info('==> 💻  Open http://localhost:%s in a browser to view the app.', config.port);
	});

} else {

	console.error('==>     ERROR: No PORT environment variable has been specified');
}
