import React from 'react';
import { Route } from 'react-router';
import { App, CreateAccount, CreatePub, CreateJournal, Landing, Label, Journal, Login, Pub, Search, SignUp, NoMatch, User, ResetPassword, ChangePassword } from 'containers';

export default (
	<Route component={App}>
		<Route path="/" component={Landing} />
		<Route path="/login" component={Login} />
		<Route path="/signup" component={SignUp} />
		<Route path="/resetpassword" component={ResetPassword} />
		<Route path="/changepassword" component={ChangePassword} />


		<Route path="/search" component={Search} />

		<Route path="/users/create/:hash" component={CreateAccount} />
		<Route path="/user/:username" component={User} />
		<Route path="/user/:username/:mode" component={User} />

		<Route path="/label/:title" component={Label} />

		<Route path="/pubs/create" component={CreatePub} />
		<Route path="/pub/:slug" component={Pub} />
		<Route path="/pub/:slug/:meta" component={Pub} />
		<Route path="/pub/:slug/files/:filename" component={Pub} />

		<Route path="/journals/create" component={CreateJournal} />
		<Route path="/:slug" component={Journal} />
		<Route path="/:slug/:mode" component={Journal} />
		<Route path="/:slug/:mode/:collection" component={Journal} />

		<Route path="*" component={NoMatch} />
	</Route>
);
