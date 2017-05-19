import { action, linkTo, storiesOf } from '@kadira/storybook';

import { Provider } from 'react-redux';
import React from 'react';
import configureStore from '../app/configureStore';
import fetch from 'isomorphic-fetch';
import journalStories from './journals/stories';

const store = configureStore();

global.clientFetch = function(route, opts) {
	const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === 'www.funky.com' || window.location.hostname === 'www.funkynocors.com';
	const isRemoteDev = window.location.hostname === 'dev.pubpub.org' || window.location.hostname === 'test.epsx.org' || window.location.hostname === 'testnocors.epsx.org';

	let urlPrefix = 'https://dev.pubpub.org';
  /*
	if (window.isJournal && isLocalDev) { urlPrefix = 'http://localhost:3000'; }
	if (window.isJournal && isRemoteDev) { urlPrefix = 'https://dev.pubpub.org'; }
	if (window.isJournal && !isLocalDev && !isRemoteDev) { urlPrefix = 'https://www.pubpub.org'; }
  */
	// If we're on a journal, we need to query routes directly to pubpub.org
	// so that cookies are included.
	const finalRoute = urlPrefix + route;

	return fetch(finalRoute, {
		...opts,
		// credentials: 'same-origin'
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	});
};

const addDecorator = (storyModule) => {
  return storyModule.addDecorator((getStory) => (<Provider store={store}>
    { getStory() }
   </Provider>
 ));
}

journalStories(addDecorator(storiesOf('Journals', module)));
