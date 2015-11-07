import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, Editor, Explore, Landing, Profile, Reader, NotFound, SubdomainTest} from 'containers';

export default () => {
	
	return (
		<Route path="/" component={App}>
		
			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/explore" component={Explore}/>
			<Route path="/profile/:username" component={Profile}/>
			<Route path="/pub/:slug" component={Reader}/>
			<Route path="/pub/:slug/edit" component={Editor}/>
			<Route path="/subdomain" component={SubdomainTest}/>

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
