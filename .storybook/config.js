import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { BrowserRouter } from 'react-g-analytics';
import { FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

const RouterDecorator = (storyFn) => {
	return (
		<BrowserRouter id="*">
			{ storyFn() }
		</BrowserRouter>
	);
};

/* Require stories */
const req = require.context('../stories/', true, /Stories\.js$/);
function loadStories() {
	addDecorator(RouterDecorator);
	req.keys().forEach(req);
}
/* Set Storybook options */
setOptions({
	showDownPanel: false,
});

configure(loadStories, module);

/* Require default styles as done in App/App.js */
require('containers/App/app.scss');
