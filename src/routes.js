import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, Editor, Explore, Landing, Profile, Reader, NotFound} from 'containers';

export default () => {
	return (
		<Route path="/" component={App}>
			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/edit" component={Editor}/>
			<Route path="/explore" component={Explore}/>
			<Route path="/profile" component={Profile}/>
			<Route path="/read" component={Reader}/>

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />
		</Route>
	);

};


