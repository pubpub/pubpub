import React from 'react';
import { Route } from 'react-router';
import App from 'containers/App/App';

function getComponent(component) {
	return (location, cb)=> {
		System.import(`containers/${component}/${component}`)
		.then(function(module) {
			cb(null, module.default);
		})
		.catch(function(error) {
			throw new Error(`Dynamic page loading failed: ${error}`);
		});
	};
}

// function buildProps(componentName) {
// 	const isProduction = process.env.NODE_ENV === 'production';
// 	return {
// 		component: isProduction ? undefined : require(`containers/${componentName}/${componentName}`).default,
// 		getComponent: isProduction ? getComponent(componentName) : undefined,
// 	};
// }

// export default (
// 	<Route component={App}>
// 		<Route path="/" {...buildProps('Landing')} />
// 		<Route path="/login" {...buildProps('Login')} />
// 		<Route path="/signup" {...buildProps('SignUp')} />
// 		<Route path="/resetpassword" {...buildProps('ResetPassword')} />
// 		<Route path="/resetpassword/:resetHash/:username" {...buildProps('ResetPassword')} />

// 		<Route path="/search" {...buildProps('Search')} />

// 		<Route path="/users/create/:hash" {...buildProps('CreateAccount')} />
// 		<Route path="/user/:username" {...buildProps('User')} />
// 		<Route path="/user/:username/:mode" {...buildProps('User')} />

// 		<Route path="/label/:title" {...buildProps('Label')} />
// 		<Route path="/label/:title/:mode" {...buildProps('Label')} />

// 		<Route path="/pubs/create" {...buildProps('CreatePub')} />
// 		<Route path="/pub/:slug" {...buildProps('Pub')} />
// 		<Route path="/pub/:slug/:meta" {...buildProps('Pub')} />
// 		<Route path="/pub/:slug/files/:filename" {...buildProps('Pub')} />

// 		<Route path="/journals/create" {...buildProps('CreateJournal')} />
// 		<Route path="/:slug" {...buildProps('Journal')} />
// 		<Route path="/:slug/:mode" {...buildProps('Journal')} />
// 		<Route path="/:slug/:mode/:pageSlug" {...buildProps('Journal')} />
// 		<Route path="*" {...buildProps('NoMatch')} />
// 	</Route>
// );

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
