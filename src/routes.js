import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, Editor, Explore, Landing, Profile, Reader, NotFound, SubdomainTest} from 'containers';

export default () => {

	return (
		<Route path="/" component={App}>
		
			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/edit/:slug" component={Editor}/>
			<Route path="/explore" component={Explore}/>
			<Route path="/profile/:username" component={Profile}/>
			<Route path="/pub/:slug" component={Reader}/>
			<Route path="/subdomain" component={SubdomainTest}/>

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
