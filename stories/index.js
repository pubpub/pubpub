import React from 'react';
import { addDecorator } from '@storybook/react';
import { BrowserRouter } from 'react-g-analytics';
import { FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

/* Require default styles as done in App/App.js */
require('containers/App/blueprint.scss');
require('containers/App/app.scss');

const RouterDecorator = (storyFn) => {
	return (
		<BrowserRouter id="*">
			{ storyFn() }
		</BrowserRouter>
	);
};
addDecorator(RouterDecorator);

/* Require stories */
require('./headerStories');
require('./header2Stories');
