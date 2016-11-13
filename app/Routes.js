import React from 'react';
import { Route } from 'react-router';
import { App, CreateAccount, Landing, Pub, SignUp, NoMatch } from 'containers';

export default (
	<Route component={App}>
		<Route path="/" component={Landing} />
		<Route path="/signup" component={SignUp} />
		<Route path="/login" component={SignUp} />
		<Route path="/user/create/:hash" component={CreateAccount} />

		<Route path="/pub/:slug" component={Pub} />
		<Route path="/pub/:slug/:meta" component={Pub} />
		<Route path="*" component={NoMatch} />
	</Route>
);
