import React from 'react';
import { Route } from 'react-router';
import App from 'containers/App/App';

// throws an error in the console if the page wasn't able to load
function errorLoading(error) {
	throw new Error(`Dynamic page loading failed: ${error}`);
}

function loadRoute(cb) {
	return module => cb(null, module.default);
}

function getComponent(component) {
	return (location, cb)=> {
		System.import(`containers/${component}/${component}`).then(loadRoute(cb, false)).catch(errorLoading);
	};
}

export default (
	<Route component={App}>
		<Route path="/" getComponent={getComponent('Landing')} />
		<Route path="/login" getComponent={getComponent('Login')} />
		<Route path="/signup" getComponent={getComponent('SignUp')} />
		<Route path="/resetpassword" getComponent={getComponent('ResetPassword')} />
		<Route path="/resetpassword/:resetHash/:username" getComponent={getComponent('ResetPassword')} />

		<Route path="/search" getComponent={getComponent('Search')} />

		<Route path="/users/create/:hash" getComponent={getComponent('CreateAccount')} />
		<Route path="/user/:username" getComponent={getComponent('User')} />
		<Route path="/user/:username/:mode" getComponent={getComponent('User')} />

		<Route path="/label/:title" getComponent={getComponent('Label')} />
		<Route path="/label/:title/:mode" getComponent={getComponent('Label')} />

		<Route path="/pubs/create" getComponent={getComponent('CreatePub')} />
		<Route path="/pub/:slug" getComponent={getComponent('Pub')} />
		<Route path="/pub/:slug/:meta" getComponent={getComponent('Pub')} />
		<Route path="/pub/:slug/files/:filename" getComponent={getComponent('Pub')} />

		<Route path="/journals/create" getComponent={getComponent('CreateJournal')} />
		<Route path="/:slug" getComponent={getComponent('Journal')} />
		<Route path="/:slug/:mode" getComponent={getComponent('Journal')} />
		<Route path="/:slug/:mode/:pageSlug" getComponent={getComponent('Journal')} />
		<Route path="*" getComponent={getComponent('NoMatch')} />
	</Route>
);
