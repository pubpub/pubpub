import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, Collection, Editor, Explore, GroupCreate, GroupProfile, JournalCreate, JournalProfile, Landing, NotFound, PubCreate, PubMeta, PubReader, ResetPassword, SubdomainTest, UserProfile} from 'containers';

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/collection/:slug" component={Collection}/>
			<Route path="/collection/:slug/:mode" component={Collection}/>
			<Route path="/collections" component={Explore}/>

			<Route path="/explore" component={Explore}/>

			<Route path="/group/:groupSlug" component={GroupProfile}/>
			<Route path="/group/:groupSlug/:mode" component={GroupProfile}/>
			
			<Route path="/groups/create" component={GroupCreate}/>

			<Route path="/journal/:subdomain" component={JournalProfile}/>
			<Route path="/journal/:subdomain/:mode" component={JournalProfile}/>
			
			<Route path="/journals" component={Explore}/>
			<Route path="/journals/create" component={JournalCreate}/>

			<Route path="/pub/:slug" component={PubReader}/>
			<Route path="/pub/:slug/draft" component={Editor}/>
			<Route path="/pub/:slug/:meta" component={PubMeta}/>
			<Route path="/pub/:slug/:meta/:metaID" component={PubMeta}/> // Used for discussions

			<Route path="/pubs" component={Explore}/>
			<Route path="/pubs/create" component={PubCreate}/>

			<Route path="/resetpassword" component={ResetPassword}/>
			<Route path="/resetpassword/:hash/:username" component={ResetPassword}/>

			<Route path="/subdomain" component={SubdomainTest}/>
			
			<Route path="/user/:username" component={UserProfile}/>
			<Route path="/user/:username/:mode" component={UserProfile}/>

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
