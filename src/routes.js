import React from 'react';
import {IndexRoute, Route} from 'react-router';
<<<<<<< Updated upstream
import {App, AtomReader, AtomEditor, EmailVerification, JournalCreate, JournalProfile, Landing, Login, ResetPassword, SignUp, UserProfile} from 'containers';
import {About, AboutJournals, AboutPubs, AboutReviews, NotFound} from 'components';

function loadComponent(component) {
	if (__CLIENT__ && !__DEVELOPMENT__) return (location, cb) => component(module => cb(null, module.default || module));
	else if (__SERVER__ || __DEVELOPMENT__) return (location, cb) => cb(null, component.default || component);
	
	// If we didn't hit one of the above return statements, something strange has happened.
	console.error('Uh oh. Something strange happened in src/routes.js');
}
=======
import {App, Editor, EmailVerification, GroupCreate, GroupProfile, JournalCreate, JournalProfile, Landing, Login, PubCreate, PubReader, ResetPassword, SignUp, UserProfile} from 'containers';
import {About, AboutJournals, AboutPubs, AboutReviews, NotFound} from 'components';
>>>>>>> Stashed changes

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/about" component={About}/>
<<<<<<< Updated upstream

			<Route path="/pub/:slug" getComponent={loadComponent(AtomReader)}/>
			<Route path="/pub/:slug/edit" getComponent={loadComponent(AtomEditor)}/>
			<Route path="/pub/:slug/:meta" getComponent={loadComponent(AtomReader)}/>

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

			{/* <Route path="/settings" getComponent={loadComponent(UserSettings)}/> */}
			{/* <Route path="/settings/:mode" getComponent={loadComponent(UserSettings)}/> */}
=======

			<Route path="/group/:groupSlug" component={GroupProfile}/>
			<Route path="/group/:groupSlug/:mode" component={GroupProfile}/>
			<Route path="/groups/create" component={GroupCreate}/>

			<Route path="/journals" component={AboutJournals}/>
			<Route path="/journals/create" component={JournalCreate}/>

			<Route path="/login" component={Login}/>

			<Route path="/pub/:slug" component={PubReader}/> {/* /pub/designandscience?journal=jods or /pub/designandscience?journal=impacts&version=8 */}
			<Route path="/pub/:slug/draft" component={Editor}/> {/* /pub/designandscience/draft */}
			<Route path="/pub/:slug/:meta" component={PubReader}/> {/* /pub/designandscience/history or /pub/designandscience/source?version=8 */}
			<Route path="/pubs" component={AboutPubs}/>
			<Route path="/pubs/create" component={PubCreate}/>
>>>>>>> Stashed changes

			<Route path="/user/:username" getComponent={loadComponent(UserProfile)}/> {/* /user/kate?filter=unpublished */}
			<Route path="/user/:username/:mode" getComponent={loadComponent(UserProfile)}/> {/* /user/kate/discussions?page=4 or /user/kate/settings */}
			
			<Route path="/signup" getComponent={loadComponent(SignUp)}/>

<<<<<<< Updated upstream
			<Route path="/verify/:hash" getComponent={loadComponent(EmailVerification)}/>

			<Route path="/:slug" getComponent={loadComponent(JournalProfile)}/> {/* /jods or /jods?collection=fall2015 */}
			<Route path="/:slug/:mode" getComponent={loadComponent(JournalProfile)}/> {/* /jods/about or /jods/settings */}
=======
			<Route path="/reviews" component={AboutReviews}/>

			<Route path="/user/:username" component={UserProfile}/> {/* /user/kate?filter=unpublished */}
			<Route path="/user/:username/:mode" component={UserProfile}/> {/* /user/kate/discussions?page=4 or /user/kate/settings */}
			
			<Route path="/signup" component={SignUp}/>

			<Route path="/verify/:hash" component={EmailVerification}/>

			<Route path="/:subdomain" component={JournalProfile}/> {/* /jods or /jods?collection=fall2015 */}
			<Route path="/:subdomain/:mode" component={JournalProfile}/> {/* /jods/about or /jods/settings */}
>>>>>>> Stashed changes

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
