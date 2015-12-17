import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, CreateJournal, CreatePub, Editor, Explore, JournalAdmin, Landing, Profile, PubMeta, PubReader, NotFound, SubdomainTest} from 'containers';

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			
			<Route path="/explore" component={Explore}/>

			<Route path="/journal" component={JournalAdmin}/>
			<Route path="/journals/create" component={CreateJournal}/>
			
			<Route path="/user/:username" component={Profile}/>

			<Route path="/pub/:slug" component={PubReader}/>
			<Route path="/pub/:slug/edit" component={Editor}/>
			<Route path="/pub/:slug/:meta" component={PubMeta}/>
			<Route path="/pubs/create" component={CreatePub}/>
			<Route path="/subdomain" component={SubdomainTest}/>

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
