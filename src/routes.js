import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, Atom, EmailVerification, Embed, JournalCreate, JournalProfile, Landing, Login, Manage, ResetPassword, SignUp, UserProfile} from 'containers';
import {About, AboutJournals, AboutPubs, AboutReviews, NotFound} from 'components';

function loadComponent(component) {
	if (__CLIENT__ && !__DEVELOPMENT__) return (location, cb) => component(module => cb(null, module.default || module));
	else if (__SERVER__ || __DEVELOPMENT__) return (location, cb) => cb(null, component.default || component);

	// If we didn't hit one of the above return statements, something strange has happened.
	console.error('Uh oh. Something strange happened in src/routes.js');
}

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/about" component={About}/>

			<Route path="/pub/:slug" getComponent={loadComponent(Atom)}/>
			<Route path="/pub/:slug/:meta" getComponent={loadComponent(Atom)}/>
			<Route path="/embed/:slug" getComponent={loadComponent(Embed)}/>

			{/*
			<Route path="/group/:groupSlug" getComponent={loadComponent(GroupProfile)}/>
			<Route path="/group/:groupSlug/:mode" getComponent={loadComponent(GroupProfile)}/>
			<Route path="/groups/create" getComponent={loadComponent(GroupCreate)}/>
			*/}

			<Route path="/journals" getComponent={loadComponent(AboutJournals)}/>

			<Route path="/journals/create" getComponent={loadComponent(JournalCreate)}/>

			<Route path="/login" getComponent={loadComponent(Login)}/>

			<Route path="/pubs" getComponent={loadComponent(AboutPubs)}/>

			<Route path="/resetpassword" getComponent={loadComponent(ResetPassword)}/>
			<Route path="/resetpassword/:hash/:username" getComponent={loadComponent(ResetPassword)}/>

			<Route path="/reviews" getComponent={loadComponent(AboutReviews)}/>

			<Route path="/manage" getComponent={loadComponent(Manage)}/>

			<Route path="/user/:username" getComponent={loadComponent(UserProfile)}/> {/* /user/kate?filter=unpublished */}
			<Route path="/user/:username/:mode" getComponent={loadComponent(UserProfile)}/> {/* /user/kate/discussions?page=4 or /user/kate/settings */}
			
			<Route path="/signup" getComponent={loadComponent(SignUp)}/>

			<Route path="/verify/:hash" getComponent={loadComponent(EmailVerification)}/>

			<Route path="/:slug" getComponent={loadComponent(JournalProfile)}/> {/* /jods or /jods?collection=fall2015 */}
			<Route path="/:slug/:mode" getComponent={loadComponent(JournalProfile)}/> {/* /jods/about or /jods/settings */}

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
