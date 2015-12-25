import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, Editor, Explore, JournalCreate, JournalProfile, Landing, NotFound, PubCreate, PubMeta, PubReader, SubdomainTest, UserProfile} from 'containers';

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/explore" component={Explore}/>

			<Route path="/journal/:subdomain" component={JournalProfile}/>
			<Route path="/journal/:subdomain/:mode" component={JournalProfile}/>
			<Route path="/journals/create" component={JournalCreate}/>

			<Route path="/pub/:slug" component={PubReader}/>
			<Route path="/pub/:slug/edit" component={Editor}/>
			<Route path="/pub/:slug/:meta" component={PubMeta}/>
			<Route path="/pub/:slug/:meta/:metaID" component={PubMeta}/> // Used for discussions
			<Route path="/pubs/create" component={PubCreate}/>
			
			<Route path="/subdomain" component={SubdomainTest}/>
			<Route path="/user/:username" component={UserProfile}/>
			<Route path="/user/:username/:mode" component={UserProfile}/>

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
