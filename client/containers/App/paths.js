import React from 'react';
import {
	About,
	AdminDashboard,
	CommunityCreate,
	Dashboard,
	DashboardMembers,
	DashboardOverview,
	Explore,
	Landing,
	Login,
	NoMatch,
	Page,
	PasswordReset,
	Pricing,
	Privacy,
	Pub,
	Search,
	Signup,
	Terms,
	User,
	UserCreate,
} from 'containers';

export default (viewData, locationData, chunkName) => {
	const paths = {
		About: {
			activeComponent: () => <About {...viewData} />,
			hideNav: locationData.isBasePubPub,
		},
		AdminDashboard: {
			activeComponent: () => <AdminDashboard {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		CommunityCreate: {
			activeComponent: () => <CommunityCreate {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		Dashboard: {
			activeComponent: () => <Dashboard {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		DashboardMembers: {
			activeComponent: () => <DashboardMembers {...viewData} />,
			isDashboard: true,
		},
		DashboardOverview: {
			activeComponent: () => <DashboardOverview {...viewData} />,
			isDashboard: true,
		},
		Explore: {
			activeComponent: () => <Explore {...viewData} />,
			hideNav: true,
		},
		Landing: {
			activeComponent: () => <Landing {...viewData} />,
			hideNav: true,
		},
		Login: {
			activeComponent: () => <Login {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		NoMatch: {
			activeComponent: () => <NoMatch {...viewData} />,
			hideNav: locationData.isBasePubPub,
			hideFooter: true,
		},
		Page: {
			activeComponent: () => <Page {...viewData} />,
		},
		PasswordReset: {
			activeComponent: () => <PasswordReset {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		Pricing: {
			activeComponent: () => <Pricing {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		Privacy: {
			activeComponent: () => <Privacy {...viewData} />,
			hideNav: locationData.isBasePubPub,
		},
		Pub: {
			activeComponent: () => <Pub {...viewData} />,
		},
		Search: {
			activeComponent: () => <Search {...viewData} />,
			hideNav: locationData.isBasePubPub,
			hideFooter: true,
		},
		Signup: {
			activeComponent: () => <Signup {...viewData} />,
			hideNav: true,
			hideFooter: true,
		},
		Terms: {
			activeComponent: () => <Terms {...viewData} />,
			hideNav: locationData.isBasePubPub,
		},
		User: {
			activeComponent: () => <User {...viewData} />,
			hideNav: locationData.isBasePubPub,
		},
		UserCreate: {
			activeComponent: () => <UserCreate {...viewData} />,
			hideNav: locationData.isBasePubPub,
			hideFooter: true,
		},
	};
	return paths[chunkName];
};
