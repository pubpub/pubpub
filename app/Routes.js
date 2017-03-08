import React from 'react';
import { Route } from 'react-router';
import App from 'containers/App/App';

const host = window.location.hostname;
const isJournal = host !== 'www.pubpub.org' && 
	host !== 'dev.pubpub.org' && 
	host !== 'staging.pubpub.org' && 
	host !== 'localhost';

window.isJournal = isJournal;

function getComponent(mainComponent, journalComponent) {
	return (locationObject, cb)=> {
		const component = isJournal ? journalComponent : mainComponent;
		if (component === 'redirect') {
			window.location.replace(`https://www.pubpub.org${locationObject.location.pathname}${locationObject.location.search}`);
		}

		System.import(`containers/${component}/${component}`)
		.then(function(module) {
			cb(null, module.default);
		})
		.catch(function(error) {
			throw new Error(`Dynamic page loading failed: ${error}`);
		});
	};
}

const routes = (
	<Route component={App}>
		<Route path="/" getComponent={getComponent('Landing', 'Journal')} />
		<Route path="/login" getComponent={getComponent('Login', 'redirect')} />
		<Route path="/signup" getComponent={getComponent('SignUp', 'redirect')} />
		<Route path="/resetpassword" getComponent={getComponent('ResetPassword', 'redirect')} />
		<Route path="/resetpassword/:resetHash/:username" getComponent={getComponent('ResetPassword', 'redirect')} />

		<Route path="/search" getComponent={getComponent('Search', 'redirect')} />

		<Route path="/users/create/:hash" getComponent={getComponent('CreateAccount', 'redirect')} />
		<Route path="/user/:username" getComponent={getComponent('User', 'redirect')} />
		<Route path="/user/:username/:mode" getComponent={getComponent('User', 'redirect')} />

		<Route path="/label/:slug" getComponent={getComponent('Label', 'redirect')} />
		<Route path="/label/:slug/:mode" getComponent={getComponent('Label', 'redirect')} />

		<Route path="/pubs/create" getComponent={getComponent('CreatePub', 'redirect')} />
		<Route path="/pub/:slug" getComponent={getComponent('Pub', 'redirect')} />
		<Route path="/pub/:slug/:meta" getComponent={getComponent('Pub', 'redirect')} />
		<Route path="/pub/:slug/files/:filename" getComponent={getComponent('Pub', 'redirect')} />

		<Route path="/journals/create" getComponent={getComponent('CreateJournal', 'redirect')} />

		{!isJournal &&
			<span>
				<Route path="/:slug" getComponent={getComponent('Journal', undefined)} />
				<Route path="/:slug/:mode" getComponent={getComponent('Journal', undefined)} />
				<Route path="/:slug/:mode/:pageSlug" getComponent={getComponent('Journal', undefined)} />
			</span>
		}
		
		{isJournal &&
			<span>
				<Route path="/:mode" getComponent={getComponent(undefined, 'Journal')} />	
				<Route path="/:mode/:pageSlug" getComponent={getComponent(undefined, 'Journal')} />
			</span>
		}
			
		<Route path="*" getComponent={getComponent('NoMatch')} />
	</Route>
);

export default routes;
