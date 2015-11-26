import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { devTools } from 'redux-devtools';
import transitionMiddleware from './middleware/transitionMiddleware';

import {default as reducer} from './reducers';

export default function createStore(reduxReactRouter, getRoutes, createHistory, client, data) {
	const middleware = [createMiddleware(client), transitionMiddleware];

	let finalCreateStore;
	if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
		const { persistState } = require('redux-devtools');
		// const DevTools = require('../containers/DevTools/DevTools');
		finalCreateStore = compose(
			applyMiddleware(...middleware),
			window.devToolsExtension ? window.devToolsExtension() : devTools(),
			persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
		)(_createStore);
	} else {
		finalCreateStore = applyMiddleware(...middleware)(_createStore);
	}

	finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);

	
	const store = finalCreateStore(reducer, data);

	if (__DEVELOPMENT__ && module.hot) {
		module.hot.accept('./reducers', () => {
			store.replaceReducer(reducer);
		});
	}

	return store;
}
