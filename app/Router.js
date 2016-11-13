/* eslint no-inner-declarations: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import ga from 'react-ga';
import { renderToStaticMarkup } from 'react-dom/server';
import { Router, match, RouterContext, browserHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { Root } from 'containers';
import routes from './Routes';
import configureStore from './configureStore';


const isClient = typeof document !== 'undefined';

if (isClient) {
	const store = configureStore(window.__INITIAL_STATE__);
	
	// ga.initialize('UA-85097FF6-1');

	function logPageView() {
		ga.set({ page: window.location.pathname });
		ga.pageview(window.location.pathname);
	}

	global.clientFetch = function(route, opts) {
		return fetch(route, {
			...opts,
			credentials: 'same-origin'
		})
		.then((response)=> {
			if (!response.ok) { 
				return response.json().then(err => { throw err; });
			}
			return response.json();
		});
	};

	ReactDOM.render(
		<Provider store={store}>
			<Router 
				history={browserHistory} 
				routes={routes} 
				onUpdate={logPageView} 
				render={applyRouterMiddleware(useScroll((prevRouterProps, nextRouterProps) => {
					// Don't scroll if only the query is changing.
					if (prevRouterProps && prevRouterProps.location.pathname === nextRouterProps.location.pathname) {
						return false;
					}

					return true;
				}))} 
			/>
		</Provider>,
		document.getElementById('root')
	);
}

function renderComponentWithRoot(req, Component, componentProps, store) {
	const componentHtml = (
		<Provider store={store}>
			<Component {...componentProps} />
		</Provider>
	);

	const head = Helmet.rewind();
	const initialState = store.getState();
	return '<!doctype html>\n' + renderToStaticMarkup(
		<Root radiumConfig={{ userAgent: req.headers['user-agent'] }} content={componentHtml} initialState={initialState} head={head} />
	);
}

function handleError(res, error) {
	res.status(500).send(error.message);
}

function handleRedirect(res, redirectLocation) {
	res.redirect(302, redirectLocation.pathname + redirectLocation.search);
}

function routeIsUnmatched(renderProps) {
	return renderProps.routes[renderProps.routes.length - 1].path === '*';
}

function handleRoute(req, res, renderProps) {
	const store = configureStore();
	const status = routeIsUnmatched(renderProps) ? 404 : 200;
	const readyOnAllActions = renderProps.components
		.filter((component) => component.readyOnActions)
		.map((component) => component.readyOnActions(store.dispatch, renderProps.params));

	Promise
		.all(readyOnAllActions)
		.then(() => res.status(status).send(renderComponentWithRoot(req, RouterContext, renderProps, store)));
}

function serverMiddleware(req, res) {
	
	global.clientFetch = function(route, opts) {
		return fetch(process.env.SITE_URL + route, {
			...opts,
			headers: {
				cookie: req.get('cookie')
			}
		})
		.then((response)=> {
			if (!response.ok) { 
				return response.json().then(err => { throw err; });
			}
			return response.json();
		});
	};

	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			handleError(error);
		} else if (redirectLocation) {
			handleRedirect(res, redirectLocation);
		} else if (renderProps) {
			handleRoute(req, res, renderProps);
		} else {
			// This should actually never happen, as Routes.js has a catch-all '*' path.
			res.sendStatus(404);
		}
	});
}

export default serverMiddleware;
