import { FocusStyleManager } from '@blueprintjs/core';
FocusStyleManager.onlyShowFocusOnTabs();

/* Require default styles as done in App/App.js */
require('containers/App/blueprint.scss');
require('containers/App/app.scss');

/* Require stories */
require('./headerStories');
require('./header2Stories');
