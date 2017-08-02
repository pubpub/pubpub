/* global Raven */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-g-analytics';
import { FocusStyleManager } from '@blueprintjs/core';

import App from 'containers/App/App';
import ManageScroll from 'components/ManageScroll/ManageScroll';
import store from './store';

require('./manageServiceWorker');

Raven.config('https://b4764efd07c240488d390c8343193208@sentry.io/197897').install();
FocusStyleManager.onlyShowFocusOnTabs();

const Root = () => (
	<Provider store={store}>
		<BrowserRouter id="UA-61723493-6">
			<ManageScroll>
				<App />
			</ManageScroll>
		</BrowserRouter>
	</Provider>
);

export default Root;

if (!module.hot) render(<Root />, document.querySelector('react'));
